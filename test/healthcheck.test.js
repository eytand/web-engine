import { expect } from 'chai'
import request from 'request'
import sinon from 'sinon'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {initServer} from '../index'
const base = 'http://localhost:3000'


describe('healthcheck API', () => {

	it('test parent healtcheck service , inject success as response and return 200', done => {
		var {app, container } = initServer()
		sinon.spy(container.cradle.healthcheckParentService, 'setHealthcheckChildService')
		const status = {status:'success'}
		container.cradle.healthcheckParentService.setHealthcheckChildService(status)
		var srv = app.listen(3000, async () => {

			setTimeout(() => {
				request.get(`${base}/healthcheck`, (err, res, body) => {
					console.log('Body reponse from healthcheck' ,body)
					srv.close()
					expect(res.statusCode).to.equal(200)
					done()
				})
				container.cradle.healthcheckParentService.setHealthcheckChildService.restore()

			},250)

		})
 
	})
  
	it('test parent service and return failure status, service should return 500',async() =>{
        
		var {container } = initServer()
		var mock = new MockAdapter(axios)
		const status = {status:'failure'}
		mock.onGet(/http:\/\/(.*?)\/healthcheck\//).reply(200, status)
		sinon.spy(container.cradle.healthcheckParentService, 'setHealthcheckChildService')
		container.cradle.healthcheckParentService.setHealthcheckChildService(status)
		let result = await container.cradle.healthcheckParentService.check()
		expect(result).to.be.false
		container.cradle.healthcheckParentService.setHealthcheckChildService.restore()
		mock.restore()

	})

	it('test failire message from child service',async() =>{
		var {container } = initServer()
		var mock = new MockAdapter(axios)
		const status = {status:'failure'}
		mock.onGet(/http:\/\/(.*?)\/healthcheck\//).reply(200, status)
		sinon.spy(container.cradle.healthcheckParentService, 'setHealthcheckChildService')
		container.cradle.healthcheckParentService.setHealthcheckChildService(status)
		let childResult = await container.cradle.healthcheckParentService.getHealthcheckChildService()
		expect(childResult).to.deep.equal(status)
		container.cradle.healthcheckParentService.setHealthcheckChildService.restore()
		mock.restore()

	})

})
