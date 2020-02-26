## Functions

<dl>
<dt><a href="#connect">connect([host])</a></dt>
<dd></dd>
<dt><a href="#Exchange">Exchange(name, [type], [options])</a></dt>
<dd></dd>
</dl>

<a name="connect"></a>

## connect([host])
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [host] | <code>string</code> | default is process.env.RMQ_HOST || 'amqp://rabbitmq:5672' |

<a name="Exchange"></a>

## Exchange(name, [type], [options])
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the exchange |
| [type] | <code>string</code> | 'direct', 'fanout' etc, default is 'direct' |
| [options] | <code>object</code> | amqp channel.assertExchange options object |


* [Exchange(name, [type], [options])](#Exchange)
    * [.subscribe(queue, consumeHandler, [routingKey], [prefetch], [messageTtl])](#Exchange+subscribe)
    * [.ack(message)](#Exchange+ack)
    * [.publish(routingKey, message, [options])](#Exchange+publish)
    * [.sendRPCMessage(queue, message, [timeout])](#Exchange+sendRPCMessage)
    * [.replyToRPC(message, reply)](#Exchange+replyToRPC)

<a name="Exchange+subscribe"></a>

### exchange.subscribe(queue, consumeHandler, [routingKey], [prefetch], [messageTtl])
**Kind**: instance method of [<code>Exchange</code>](#Exchange)  

| Param | Type | Description |
| --- | --- | --- |
| queue | <code>string</code> | name of queue |
| consumeHandler | <code>function</code> | handler function to call when message arrives on queue |
| [routingKey] | <code>string</code> | optional routing key, defaults to queue name |
| [prefetch] | <code>number</code> | optional number of messages to prefetch, default is 1 |
| [messageTtl] | <code>number</code> | optional time to live for messages on the queue, default is process.env.RMQ_MESSAGE_TTL || 10000 |

<a name="Exchange+ack"></a>

### exchange.ack(message)
**Kind**: instance method of [<code>Exchange</code>](#Exchange)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | message to ack |

<a name="Exchange+publish"></a>

### exchange.publish(routingKey, message, [options])
**Kind**: instance method of [<code>Exchange</code>](#Exchange)  

| Param | Type | Description |
| --- | --- | --- |
| routingKey | <code>string</code> | optional routing key, defaults to queue name |
| message | <code>object</code> | message to send (JSON object) |
| [options] | <code>object</code> | amqplib options object for publish method |

<a name="Exchange+sendRPCMessage"></a>

### exchange.sendRPCMessage(queue, message, [timeout])
**Kind**: instance method of [<code>Exchange</code>](#Exchange)  

| Param | Type | Description |
| --- | --- | --- |
| queue | <code>string</code> | name of queue |
| message | <code>object</code> | message to send (JSON object) |
| [timeout] | <code>number</code> | time to wait for response in ms, default is process.env.RMQ_RPC_TIMEOUT || 10000 |

<a name="Exchange+replyToRPC"></a>

### exchange.replyToRPC(message, reply)
**Kind**: instance method of [<code>Exchange</code>](#Exchange)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | the original message to reply to |
| reply | <code>object</code> | JSON content of the reply messsage |

