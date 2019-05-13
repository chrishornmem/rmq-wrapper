const EventEmitter = require('events')
const amqp = require('amqplib')
const reconnectInterval = process.env.RMQ_RECONNECT_INTERVAL || 1000
const rmqHost = process.env.RMQ_HOST || "amqp://localhost"

let connection

const start = async () => {

  const e = new EventEmitter()

  amqp.connect(rmqHost).then((conn) => {

    console.log("connected!")
    connection = conn

    conn.on("error", (err) => {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message)
        e.emit("error", err)
      }
    })

    conn.on("close", () => {
      console.error("[AMQP] reconnecting")
      return setTimeout(start, reconnectInterval)
    })

    e.emit("connected")
    return e

  }).catch((err) => {
    e.emit("reconnecting")

    if (err.message !== "Connection closing") {
      console.error("[AMQP] catch:", err.message)
      return setTimeout(start, reconnectInterval)
    }
  })
  return e
}

const produce = async (queue, message, durable = true, persistent = false) => {
  const channel = await connection.createChannel()

  try {
    await channel.assertQueue(queue, { durable })
    await channel.sendToQueue(queue, Buffer.from(message), { persistent })
    console.log('Message produced: ', queue, message)
  } catch (error) {
    throw error
  }

}

// Consumer
const consume = async (queue, isNoAck = false, durable = true, prefetch = null) => {
  const channel = await connection.createChannel()

  await channel.assertQueue(queue, { durable })

  if (prefetch) {
    channel.prefetch(prefetch)
  }
  const consumeEmitter = new EventEmitter()
  try {
    channel.consume(queue, message => {
      if (message !== null) {
        consumeEmitter.emit('data', message.content.toString(), () => channel.ack(message))
      } else {
        const error = new Error('NullMessageException')
        consumeEmitter.emit('error', error)
      }
    }, { noAck: isNoAck })
  } catch (error) {
    consumeEmitter.emit('error', error)
  }
  return consumeEmitter
}

const publish = async (exchangeName, exchangeType, message) => {
  const channel = await connection.createChannel()

  try {

    await channel.assertExchange(exchangeName, exchangeType, { durable: false })
    await channel.publish(exchangeName, '', Buffer.from(message))
    console.log('Message published: ', exchangeName, message)

  } catch (error) {
    throw error
  }

}

const subscribe = async (exchangeName, exchangeType) => {
  const consumeEmitter = new EventEmitter()

  try {
    const channel = await connection.createChannel()
    await channel.assertExchange(exchangeName, exchangeType, { durable: false })
    const queue = await channel.assertQueue('', { exclusive: true })
    channel.bindQueue(queue.queue, exchangeName, '')
    channel.consume(queue.queue, message => {
      if (message !== null) {
        consumeEmitter.emit('data', message.content.toString())
      } else {
        const error = new Error('NullMessageException')
        consumeEmitter.emit('error', error)
      }
    }, { noAck: true })
  } catch (error) {
    consumeEmitter.emit('error', error)
  }
  return consumeEmitter
}

module.exports = {
  start,
  produce,
  publish,
  subscribe,
  consume
}
