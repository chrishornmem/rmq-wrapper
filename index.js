/**
 * @module rmq-wrapper
 * @desc Utility functions for connecting, producing and consuming messages on RMQ
 */
const debug = require('debug')('rmq-wrapper')
const amqp = require('amqp-connection-manager')
const config = require('./config')

// Automatically connect to a Rabbit host when this module is required
const connection = amqp.connect([config.rmqHost], { json: true })
connection.on('connect', function () {
    debug('Connected!')
})
connection.on('disconnect', function (params) {
    debug('Disconnected.', params.err.stack)
})

let wrapper // wrapper object for amqp library calls
let queues = {} // memory store to temporarily map a queue against a channel
/**
 * This method connects to a queue and calls the provided callback consumeFunction when a message is received on the queue
 *
 * @param {string} queue name of the queue to listen on
 * @param {string} consumeFunction function to call when a message is received on the queue
 * @returns {Promise} Resolved when the connection completes
 * @throws {exception}
 */
const consume = ({

    connect: (queue, consumeFunction) => {
        wrapper = connection.createChannel({
            setup: async (channel) => {
                // `channel` here is a regular amqplib `ConfirmChannel`.
                try {
                    await channel.assertQueue(queue, { durable: true })
                    await channel.prefetch(1)
                    queues[queue] = {}
                    queues[queue].channel = channel
                    let consumerTag = await channel.consume(queue, consumeFunction)
                    queues[queue].consumerTag = consumerTag.consumerTag
                    debug("consumerTag")
                    debug(queues[queue].consumerTag)
                    return Promise.resolve(queues[queue].consumerTag)
                } catch (error) {
                    debug(error)
                    return Promise.reject(error)
                }
            }
        })
        return wrapper.waitForConnect()
    }, 

    /**
     * This method should be called to acknolwedge a received message otherwise the message will be re-queued
     *
     * @param {object} data the object from the original received message that should be acked
     * @returns {boolean} true or false indicating success or failure
     */
    ack: (data) => {
        return wrapper.ack(data)
    }
})

/**
 * This produces a message on RMQ, assumes that the connect() method was previously called
 * @param {string} queue name of the queue to listen on
 * @param {string} message stringified text to be put on the queue
 * @param {boolean} [persistent="true"] if true the message is stored peristently on the queue
 * @returns {Promise} Resolved when the message was produced on the queue
 * @throws {exception}
 */
const produce = async (queue, message, persistent = true) => {
    try {
        await wrapper.sendToQueue(queue, Buffer.from(message), { persistent })
        return true
    } catch (error) {
        debug("Message was rejected:", error.stack)
        wrapper.close()
        connection.close()
        return false
    }
}

/**
 * This tells RMQ to stop announcing new messages, so the callback consumeFunction is no longer called.  The queue should be re-connected to restart message delivery.
 * @param {string} queue name of the queue to listen on
 * @returns {Promise} Resolved when the queue was cancelled
 * @throws {exception}
 */
const cancel = (queue) => {
    if (queues[queue]) {
        let consumerTag = queues[queue].consumerTag
        debug("consumerTag:")
        debug(consumerTag)
        return queues[queue].channel.cancel(consumerTag)
    } else {
        return Promise.resolve(false)
    }
}

// consume.waitForConnect()
// .then(function() {
//     debug.log("Listening for messages")
// })

module.exports = {
    consume,
    produce,
    cancel
}