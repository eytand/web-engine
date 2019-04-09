const AsyncFunction = (async () => {}).constructor

export default class HealthcheckParentService {
   
	constructor({loggerFactory, container}) {
		this.state = false
		this.logger = loggerFactory.logger
		this.hcChild = null
		this.hcService = null
		this.container = container
		this.setIsModuleInclude(module.id.includes('node_modules'))
	}

	setIsModuleInclude(value){ 
		this.isModuleInclude = value
	}
	/**
     * Get helath check service
     */
	async getHealthcheckChildService(){
		
		if(this.testFlag) {
			return this.hcService
		}
		this.hcService = {status:'failure'}
		if(this.isModuleInclude){
			
			let func = this.container.cradle.healthcheckService.check
			if(func instanceof AsyncFunction === true)          
			{
				
				this.hcService = await func()
			}
			else {
				this.hcService = func()
			}
				
		}
		return this.hcService
	}

	/**
     * Set the healthcheck service.
     * Actually the value  is for testing purpose 
     * @param {*} hcService 
     */
	async setHealthcheckChildService(value){
		this.testFlag = true
		this.hcService = value
	}

	/**
     * Call to child healthcheck service and return the response 
	 * Service will return 500 in case of error during healtcheck
     */
	async check() {
		try{
			await this.getHealthcheckChildService()
			this.logger.info('response from healthcheck' , this.hcService)
            
			if(!this.hcService || this.hcService.status === 'failure'){
				throw new Error('could not find any response from healthcheck service')
			}
            
			return this.hcService.status === 'success'
		}
		catch(err){
			this.logger.error(err)
			return false
		}

	}

}