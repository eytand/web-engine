## UVEye web engine app
TODO: add build badges here

UVEye web engine is an onopinionated Dependency Injection framework which serves as a core base to all UVEye's services
Cross-cutting services (e.g. logger, mongodb, redis, kafka etc.) can be incrementaly contributed to this framework and then can inherently be used by all services using the framework. 

## Requirements

* Node 8
* esm - The framework is coded ES6 module style, be sure to use `node -r esm <your-service>` when running. esm can be installed globally

```bash
npm i esm -g
```

## Basic Usage

First, install the module:
```bash
npm i uveye-web-engine
```

initialize the service:

```nodejs
import {initServer} from 'uveye-web-engine'

var {app, container, router} = initServer()

app.listen(3000, () => {
    console.log('server started')
}) 

//...
```
Now add your stuff here...


Externalize the container for further DI, and router

```nodejs
export function getContainer () {
    return container
}
```

## Adding your own services and routes:

Your services and routes are automatically scanned under `/src/routes` and `/src/services/` when initServer is being called.
see users.js and usersServices.js exmples 

## Other injected services and repositories

Classes exported under `/src/services` and `/src/repositories` are also automatically scanned, initialized (lazily) and added to the DI container.
Some core services were added to the module, and can be used in the apps:

* LoggerFactory

    ```nodejs
     var logger = container.cradle.loggerFactory.logger
        logger.debug('12345')
    ```
    
The Logger default configuration is set in the default and production configuration files. Essentially in production mode, the minimal log level is set to error. This configuration (as with any configuration) can be overriden in the app.

```json
{
   "logger": {
       "isLogstashEnabled":false,
       "file": {
            "level": "debug",
            "relativePath": "./logs/app.log"
        },
       "console": {
            "level": "debug",
            "handleExceptions": true,
            "json": false,
            "colorize": true
        },
        "logstash": {
            "level": "debug",
            "port": 5000,
            "node_name": "web",
            "host": "logstash"
        }
   }       
}
```

Logstash can also be overriden with environment variables:
```$CLIENT_LOGSTASH_HOST, $CLIENT_LOGSTASH_PORT, $LOGSTASH_NODE_NAME```


## Healthcheck Service
  
  Each microservice has to implement healthcheck service and healthcheck test
  ```
  export default class HealthcheckService {
      
      check(){

      }
  }
  ```

  Parent Service calls to the child service during healtcheck interval(localhost:3000/healthcheck), than return true/flase(via routing file) based on child logic
  

  check functrion Response has to be like the following format  

  ``` {"status":"success"}```
  
  or , in case of error : 

  ``` {"status":"failure"}```


  * healthcheck docker installation
    
    Each microservice docer file has include the following command:


    ``` HEALTHCHECK --interval=30s --timeout=5s CMD curl --fail http://localhost:3000/healthcheck || exit 1 ```

* The helthcheck docker service expeted to get 200 or 500 as http response 


**Please note*** - All injections within the scanned folders (`/src/services`, `/src/repositories`, `/src/routes`) can be used implicitely - no need to get the instance from the container
Example: the makeAPI function is a part of routes and hence scanned into the container. It can implicitly use userService, which is scanned as a part of services folder (notice the destructuring of the parameter): 

```nodejs
function makeAPI({ usersService }) {
//...
}
```


## Configuration

Configuration is done both at the module level and the child app level. 
Add `/config` folder to your root, and default.<type> and production.<type> (type can be virtually any configuration format), where production overrides the default values when in production mode (NODE_ENV is 'production')
Usage:
inject the config service in the constructor

```nodejs
constructor({configService})
//...
this.config.get('someKey')
this.config.get('logger.someKey')
```

## Docker support
TBD

## Dependencies

* Koa2 - The returned app is a standard koa application, which can be used with middlewares as usual (see `https://www.npmjs.com/package/koa2`)
* Awilix - the dependency Injection is deployed with Awilix standard application. Use the returned container to resolve (or to inject) functions and values   (see `https://github.com/jeffijoe/awilix`)
* node-conf - the configuration is based on the "conf" npm package. Please note, values defaulted at the framework level cannot be overidden with default values in your app! (see `https://github.com/lorenwest/node-config`)
* Bunyan logging