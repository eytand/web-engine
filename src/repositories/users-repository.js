export default class UsersRepository {
	constructor({ mongoCollectionFactory }) {
		this.factory = mongoCollectionFactory
	}

	async lazyInit() {
		if(!this.collection) {
			this.collection = await this.factory.getCollection('users')
		}
	}
    
	async getAllUsers() {
		await this.lazyInit()
		return this.collection.find()
	}
}