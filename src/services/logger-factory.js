import bunyan from 'bunyan'
import path from 'path'

/**
 * Logger service
 */
export default class LoggerFactory {
	
	constructor({configService}) {
		this.config  = configService
		this.logger = bunyan.createLogger({
			name: process.env.npm_package_name,
			version: process.env.npm_package_version,
			streams: this.initLoggerConfig()
		})

	}

	/**
	 * Init the logger configurarion and return a streams array
	 */
	initLoggerConfig(){
		let streams = []
		streams.push(this.getConsoleStreamConfig())
		streams.push(this.getFileStreamConfig())
		return streams
	}

	/**
	 * get and update the console configuration  
	 */
	getConsoleStreamConfig(){
		return {
			level: this.config.get('logger.console.level'),
			stream: process.stdout
		}
	}

	/**
	 * get and update the file stream configuration  
	 */
	getFileStreamConfig(){
		return {
			type: 'file',
			level: this.config.get('logger.file.level'),
			path: path.join(process.cwd(), this.config.get('logger.file.relativePath'))
		}
	}

	logger() {
		return this.logger
	}
}