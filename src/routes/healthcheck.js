import { makeInvoker } from 'awilix-koa'

/**
 * This is an example router with an injected service
 * Please make sure makeInvoker is being used. see {@link https://github.com/jeffijoe/awilix-koa}
 * @param {healthcheckParentService} 
 */
function makeAPI({ healthcheckParentService }) {
	return {
		healthcheck: async (ctx) => {
			let response = await healthcheckParentService.check()
      
			if(!response){
				throw new Error('not healthy , return 500',response)
			}

			ctx.body = response
		}
	}
}

export function init(router) {
	const api = makeInvoker(makeAPI) 
	router.get('/healthcheck', api('healthcheck'))
}