import mysql from 'promise-mysql'
import fs from 'fs'

export default class MysqlService {
	constructor ({configService}) {
		this.options = {}
		Object.assign(this.options, configService.get('mysql'))

		let password_file_path = configService.get('db_user_password_file') || process.env.DB_PASSWD_FILE
		if (fs.existsSync(password_file_path)) {
			let password = fs.readFileSync(password_file_path, 'utf8')
			Object.assign(this.options, {password: password.trim()})
		}
		try{
			this.pool = mysql.createPool(this.options)
			if(!this.pool) {
				this.logger.error('An error occured while connecting to mysqldb, pool was not initiated')
				process.exit(1)
			}
		} catch(err) {
			this.logger.error('An error occured while connecting to mysqldb', err)
			process.exit(1)
		}
		
	}

	async getConnection() {
		return await this.pool.getConnection()
	}

	async releaseConnection(conn) {
		return await this.pool.releaseConnection(conn)
	}
}
