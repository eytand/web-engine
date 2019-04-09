import { initServer } from '../index'
import sinon from 'sinon'
import chai from 'chai'
import chaiaspromised from 'chai-as-promised'


chai.use(chaiaspromised)
var expect = chai.expect

/*eslint-disable */
var server ,container, mysqlService
/*eslint-enable */

describe('mysql', () => {
	it('The service connects to mysql server', async () => {
		let rows = {result: '42'}
		let mock = sinon.mock(require('promise-mysql'))
		
		let getConnectionFunc = async () => {
			return {
				connect: () => {
					console.log('Succesfully connected')
				},
				query: async () => {
					return (null, rows)
				},
				end: () => {
					console.log('Connection ended')
				}
			}
		} 

		mock.expects('createPool').returns( { getConnection: getConnectionFunc })
		server = initServer(true)
		container = server.container
		mysqlService = container.cradle.mysqlService
		let conn = await mysqlService.getConnection()
		expect(conn.query('SELECT * FROM 42')).to.eventually.deep.equal(rows)
	})
})
