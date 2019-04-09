import { MongoClient } from 'mongodb'
import fs from 'fs'

export default class MongoService {
	constructor({ loggerFactory, configService }) {
		const mongoConf = configService.get('mongo')
		this.logger = loggerFactory.logger
		if(mongoConf != null) {
			this.mongoUrlFixed = configService.get('mongo.url')
			this.mongoNodeName = configService.get('mongo.mongo_node_name')
			this.logger.info('Mongodb configuration found')
		}
		this.configService = configService
	}
    
	async getConnection() {
		if(!this.mongoUrlFixed) {
			throw new Error('mongo is not configured for this service')
		}
		if(!this.conn) {
			let password_file_path = this.configService.get('mongo.mongo_user_password_file')
			if (fs.existsSync(password_file_path)) {
				let password = fs.readFileSync(password_file_path, 'utf8')				
				let user = process.env.MONGO_INITDB_ROOT_USERNAME
				
				this.mongoUrl = 'mongodb://'+user+':'+password.replace(/\n$/, '')+ '@' + this.mongoNodeName+ ':27017/' + this.mongoUrlFixed
			}
			try{
				await this.waitForMongo({timeout: 1000 * 60 * 2})
				
			} catch (err) {
				this.logger.error('An error occured while connecting to mongodb', err)
				process.exit(1)
			}
		}
		return this.conn
	}

	async waitForMongo(options) {
		return new Promise((resolve, reject) => {
			let timeouted = false 
			let timeoutHandler = setTimeout(() => {
				timeouted = true
				reject('TIMEOUTED_WAIT_FOR_MONGO')
			}, options.timeout) 

			let repeat = () => {
				setTimeout(async () => {
					if(timeouted) return
					try {
						if(!this.mongoUrl)
							this.conn = await MongoClient.connect(this.mongoUrlFixed, { useNewUrlParser: true })
						else
							this.conn = await MongoClient.connect(this.mongoUrl, { useNewUrlParser: true })
					} catch (err) {
						this.logger.debug('hanven\'t connected yet to mongodb', err)
					}
					if(!this.conn) {
						setTimeout(repeat, 2000)
					} else {
						clearTimeout(timeoutHandler)
						timeoutHandler = null
						process.on('SIGINT', () => {
							if(this.conn)
								this.conn.close()
						})
						resolve()
					}
				}, 2000) 
			}
			repeat()
		})
	}
}