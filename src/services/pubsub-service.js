import amqp from 'amqplib'

const QUEUE_TYPE = 'topic'
const AsyncFunction = (async () => {}).constructor

export default class PubsubService {
	constructor({ configService, loggerFactory }) {
		this.config = configService
		this.logger = loggerFactory.logger
		this.conn = null
	}
    
	async publish(message, routingKey, options) {
		await this.lazyInitConnection()
		options = options || {}
		let ex = options.exchange || this.config.get('pubsub.defaultExchange')
		let ch = await this.conn.createChannel()
		var common_options = {durable: true}
		ch.assertExchange(ex, QUEUE_TYPE, common_options)
		await ch.publish(ex, routingKey, new Buffer(message))
		this.logger.debug('message published:', message)
	}
    
	async subscribe(routingKey, options, func) {
		await this.lazyInitConnection()
		options = options || {}
		let ex = options.exchange || this.config.get('pubsub.defaultExchange')
		let ch = await this.conn.createChannel()
		var common_options = {durable: true, noAck: false}
		ch.assertExchange(ex, QUEUE_TYPE, common_options)
		let q = await ch.assertQueue('', {exclusive: true})
		await ch.bindQueue(q.queue, ex, routingKey)
		ch.consume(q.queue, async (msg) => {
			this.logger.debug('message received:', msg.content.toString('utf8'))
			try{
				if (func instanceof AsyncFunction === true) {
					var retVal  = await func(msg.content.toString('utf8'))
				} else {
					retVal  = func(msg.content.toString('utf8'))
				}
				
			} catch (err) {
				retVal = false
				this.logger.error('an error occured while receiving a message via subsciption', {error: err, message: msg})
			}
			if (retVal){
				ch.ack(msg)
			} 
		})
	}
    
	async lazyInitConnection() {
		if(!this.conn) {
			this.conn = await amqp.connect(this.config.get('pubsub.url'))
		}
	}

}