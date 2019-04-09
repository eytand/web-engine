import config from 'config'
import objectPath from 'object-path'
import path from 'path'

const PACKAGE = 'web-engine/package.json'
    
export default class ConfigService {

	constructor(){
		let moduleConfPath  = process.cwd()

		if(module.id.includes('node_modules')){
			moduleConfPath = path.dirname(require.resolve(PACKAGE))
		}

		const configDir = path.join(moduleConfPath, 'config')
		const baseConfig = config.util.loadFileConfigs(configDir)
		config.util.setModuleDefaults('web-engine', baseConfig)
	}

	/**
     * Get config value by key name
     * @param {*} key 
     */
	get(key) {
		if(!module.id.includes('node_modules')) {
			return config.get(`web-engine.${key}`)
		}

		let clonedConf = config.util.toObject()
		let moduleCloned = config.util.cloneDeep(config.get('web-engine'))
		let _config = config.util.makeImmutable(config.util.extendDeep(moduleCloned, clonedConf))
		return objectPath.get(_config, key)
	}
}
