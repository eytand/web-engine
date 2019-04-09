import { initServer } from '../index'
import { expect } from 'chai'
import { before } from 'mocha'
import amqp from 'amqplib'

describe('pubsub', () => {
	before(() => {
		let server = initServer()
		let container = server.container
		this.config = container.cradle.configService
		this.pubsub = container.cradle.pubsubService
	})
	it('publishes a message' , async () => {
		//this sleep is because the docker takes time to start	
		console.log('starting rabbitmq....')
		await sleep(10000)
		const testMessage = 'test message'

		let conn = await amqp.connect(this.config.get('pubsub.url'))
		let ex = this.config.get('pubsub.defaultExchange')
		let ch = await conn.createChannel()
		var common_options = {durable: true, noAck: true}
		ch.assertExchange(ex, 'topic', common_options)
		let q = await ch.assertQueue('', {exclusive: true})
		await ch.bindQueue(q.queue, ex, 'route.a')
		await this.pubsub.publish(testMessage, 'route.a')
		ch.consume(q.queue, (msg) => {
			expect(msg.content.toString('utf8')).to.equal(testMessage)
		})
	})

	it('subscibes to a message [exact routing key]' , async () => {
		const testMessage = 'test message'
		await this.pubsub.subscribe('route.a', null, (msg) => {
			expect(msg).to.equal(testMessage)
		})
		let conn = await amqp.connect(this.config.get('pubsub.url'))
		let ex = this.config.get('pubsub.defaultExchange')
		let ch = await conn.createChannel()
		var common_options = {durable: true}
		ch.assertExchange(ex, 'topic', common_options)
		await ch.publish(ex, 'route.a', new Buffer(testMessage))
		
	})

	it('subscibes to a message [match wildcard routing key]' , async () => {
		const testMessage = 'test message'
		await this.pubsub.subscribe('route.*', null, (msg) => {
			expect(msg).to.equal(testMessage)
		})
		let conn = await amqp.connect(this.config.get('pubsub.url'))
		let ex = this.config.get('pubsub.defaultExchange')
		let ch = await conn.createChannel()
		var common_options = {durable: true}
		ch.assertExchange(ex, 'topic', common_options)
		await ch.publish(ex, 'route.a', new Buffer(testMessage))
		
	})

	it('subscibes to a message [match all routing keys]' , async () => {
		const testMessage = 'test message'
		await this.pubsub.subscribe('#', null, (msg) => {
			expect(msg).to.equal(testMessage)
		})
		let conn = await amqp.connect(this.config.get('pubsub.url'))
		let ex = this.config.get('pubsub.defaultExchange')
		let ch = await conn.createChannel()
		var common_options = {durable: true}
		ch.assertExchange(ex, 'topic', common_options)
		await ch.publish(ex, 'route.a', new Buffer(testMessage))
		
	})
})

var sleep = async (millis) => {
	return new Promise (resolve => {
		setTimeout(() => resolve(), millis)
		
	})
}