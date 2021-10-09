process.env.SUPPRESS_NO_CONFIG_WARNING = 'y'
import Koa from 'koa'
import koaRouter from 'koa-router'
import bodyparser from 'koa-bodyparser'
import { createContainer, Lifetime ,asValue } from 'awilix'
import { scopePerRequest } from 'awilix-koa'
import { resolve as _resolve } from 'path'
import { sync } from 'glob'
import path from 'path'
import koaBunyanLogger from 'koa-bunyan-logger'
process.env.ALLOW_CONFIG_MUTATIONS=true

const PACKAGE = 'uveye-web-engine/package.json'

var app = new Koa()
var container = createContainer()
var router = new koaRouter()

try {
	var pathToModule = path.dirname(require.resolve(PACKAGE))
} catch(err) {
	if(process.env.NODE_ENV !== 'production') {
		/*eslint-disable*/
		console.warn("cannot resolve package. If this is test mode you can safely ignore. error message: ",err.message)
	} else {
		console.error(`cannot resolve package ${PACKAGE}`, err)
		/*eslint-enable */
		process.exit(1) 
	}
}
/**
 * this function publishes the server.
 * usage:
 * 
    var server = initServer()
    server.app.listen(3000, () => {
        console.log('server started')
    }) 

    server.container can be exported in order to register and inject additional child objects
 */
export function initServer() {
	let modulesArr = []
	//Module`s injected services:
	if(module.id.includes('node_modules')) {
		modulesArr.push([`${pathToModule}/src/services/*.js`, Lifetime.SINGLETON], 
			[`${pathToModule}/src/repositories/*.js`, Lifetime.SINGLETON]) 
	}
	//when in internal mode these will be the locally loaded services.
	//in module mode these serve as the child services
	modulesArr.push(['src/services/*.js', Lifetime.SINGLETON], 
		['src/repositories/*.js', Lifetime.SINGLETON])
	container.loadModules(
		modulesArr,
		{
			formatName: 'camelCase'
		}
	)
	
	container.register({
		container:asValue(container)
	})

	app.use(scopePerRequest(container))
	app.use(bodyparser())
	app.use(router.routes())
	app.use(koaBunyanLogger(container.cradle.loggerFactory.logger))
	app.use(koaBunyanLogger.requestIdContext())
	app.use(koaBunyanLogger.requestLogger()) 
	loadAllRoutes(router)
	return {app, container, router}
}



process.on('unhandledRejection', (err) => {
	/*eslint-disable */
	console.error(err)
	/*eslint-enable */
	process.exit(1)
})

function loadAllRoutes(rtr) {
	if(module.id.includes('node_modules')) {
		//load external (child) routes
		sync( `${pathToModule}/src/routes/**/*.js` ).forEach( function( file ) {
			let { init } = require( _resolve( file ) )
			init(rtr)
		})
	}
	//load local routes
	sync( './src/routes/**/*.js' ).forEach( function( file ) {
		let { init } = require( _resolve( file ) )
		init(rtr)
	})
   
}
