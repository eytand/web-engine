export default class MongoCollectionFactory {
	constructor({ mongoService, loggerFactory }) {
		this.mongo = mongoService
		this.logger = loggerFactory.logger
        
	}

	async getCollection(name) {
		let conn = await this.mongo.getConnection()
		let db = conn.db(conn.s.options.dbName)
		return db.collection(name)
	}
}