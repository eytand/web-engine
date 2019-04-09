## using mongo

in order to use json, first add a mongo configuration with url (including db name) to the config file of your choice:

```json

{    
    "key1": "val1",
    "key2": "val2",
    "mongo": {
        "url": "mongodb://localhost:27017/test"
    }
}

```

Then, use the collection factory to create a repository (make sure the repository resides in the src/repositories folder):

```nodejs

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

```

(The lazyInit is not necessary, but can overcome the limitation of non async constructor)