<a name="module_rmq-wrapper"></a>

## rmq-wrapper
Utility functions for connecting, producing and consuming messages on RMQ


* [rmq-wrapper](#module_rmq-wrapper)
    * [~consume](#module_rmq-wrapper..consume) ⇒ <code>Promise</code>
        * [.ack(data)](#module_rmq-wrapper..consume.ack) ⇒ <code>boolean</code>
    * [~produce(queue, message, [persistent])](#module_rmq-wrapper..produce) ⇒ <code>Promise</code>
    * [~cancel(queue)](#module_rmq-wrapper..cancel) ⇒ <code>Promise</code>

<a name="module_rmq-wrapper..consume"></a>

### rmq-wrapper~consume ⇒ <code>Promise</code>
This method connects to a queue and calls the provided callback consumeFunction when a message is received on the queue

**Kind**: inner constant of [<code>rmq-wrapper</code>](#module_rmq-wrapper)  
**Returns**: <code>Promise</code> - Resolved when the connection completes  
**Throws**:

- <code>exception</code> 


| Param | Type | Description |
| --- | --- | --- |
| queue | <code>string</code> | name of the queue to listen on |
| consumeFunction | <code>string</code> | function to call when a message is received on the queue |

<a name="module_rmq-wrapper..consume.ack"></a>

#### consume.ack(data) ⇒ <code>boolean</code>
This method should be called to acknolwedge a received message otherwise the message will be re-queued

**Kind**: static method of [<code>consume</code>](#module_rmq-wrapper..consume)  
**Returns**: <code>boolean</code> - true or false indicating success or failure  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | the object from the original received message that should be acked |

<a name="module_rmq-wrapper..produce"></a>

### rmq-wrapper~produce(queue, message, [persistent]) ⇒ <code>Promise</code>
This produces a message on RMQ, assumes that the connect() method was previously called

**Kind**: inner method of [<code>rmq-wrapper</code>](#module_rmq-wrapper)  
**Returns**: <code>Promise</code> - Resolved when the message was produced on the queue  
**Throws**:

- <code>exception</code> 


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queue | <code>string</code> |  | name of the queue to listen on |
| message | <code>string</code> |  | stringified text to be put on the queue |
| [persistent] | <code>boolean</code> | <code>&quot;true&quot;</code> | if true the message is stored peristently on the queue |

<a name="module_rmq-wrapper..cancel"></a>

### rmq-wrapper~cancel(queue) ⇒ <code>Promise</code>
This tells RMQ to stop announcing new messages, so the callback consumeFunction is no longer called.  The queue should be re-connected to restart message delivery.

**Kind**: inner method of [<code>rmq-wrapper</code>](#module_rmq-wrapper)  
**Returns**: <code>Promise</code> - Resolved when the queue was cancelled  
**Throws**:

- <code>exception</code> 


| Param | Type | Description |
| --- | --- | --- |
| queue | <code>string</code> | name of the queue to listen on |

