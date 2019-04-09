import { initServer } from '../index'
import { expect } from 'chai'
import MongoDBMemoryServer from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'
/*eslint-disable */
var server ,container
/*eslint-enable */
const dbusers = [ {userA : 'a'}, {userB : 'b'}]

describe('mongo', () => {
	let con
	let db
	let mongoServer
	before(async () => {
		mongoServer = new MongoDBMemoryServer({instance: {port: 27017, dbName: 'test'}})
		const mongoUri = await mongoServer.getConnectionString()
		console.log(mongoUri)
		con = await MongoClient.connect(mongoUri)
		db = con.db(await mongoServer.getDbName())
		server = initServer(true)
		container = server.container
	})

	after(() => {
		con.close()
		mongoServer.stop()
	})
    
	it('can connect to the db and collection', async () => {
		const col = db.collection('users')
		await col.insertMany(dbusers)
		let cursor = await container.cradle.usersRepository.getAllUsers()
		let users = await cursor.toArray()
		expect(users).to.deep.equal(dbusers)
	})

})
