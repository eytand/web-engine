import { initServer } from '../index'
import { expect} from 'chai'
import fs from 'fs'
import path from 'path'
import sinon from 'sinon'

const filePath = path.join(process.cwd(), 'logs', 'app.log')

describe('logger', () => {
	var server, container
	before(() => {
		server = initServer()
		container = server.container
		this.config = container.cradle.configService
	})
	beforeEach(async () => {
		fs.openSync(filePath, 'w')
	})

	it('test console stream config' , ()=> {
		var stub = sinon.spy(container.cradle.loggerFactory, 'getConsoleStreamConfig')
		container.cradle.loggerFactory.getConsoleStreamConfig()
		expect(stub.called).to.be.true
		stub.restore()
	}) 
	it('test file stream config' , ()=> {
		var stub = sinon.spy(container.cradle.loggerFactory, 'getFileStreamConfig')
		container.cradle.loggerFactory.getFileStreamConfig()
		expect(stub.called).to.be.true
		stub.restore()
	}) 
	
	it('can log messages', async () => {
		var logger = container.cradle.loggerFactory.logger
		logger.debug('12345')
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, 200)
		})
		var contents = fs.readFileSync(filePath, 'utf8')
		expect(JSON.parse(contents).msg).to.equal('12345')

	})
	it('can set log messages level', async () => {
		var logger = container.cradle.loggerFactory.logger
		logger.error('12345')
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, 200)
		})
		var contents = fs.readFileSync(filePath, 'utf8')
		expect(JSON.parse(contents).level).to.equal(50)
	})
})