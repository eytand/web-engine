## node-web-engine app
TODO: add build badges here

Node web engine is an unopinionated Dependency Injection framework which serves as a core base to all microservices
cross-cutting services (e.g. logger, config, mongodb, redis, kafka etc.) as well as a DI.
The web-engine requires upload to an NPM repository (or mirror), so that it'll be used as a base module to each microservice

## Requirements

* Node 8+
* esm - The framework is coded ES6 module style, be sure to use `node -r esm <your-service>` when running. esm can be installed globally

```bash
npm i esm -g
```

## Basic Usage

First, install the module:
```bash
npm i web-engine
```

initialize the service:

```nodejs
import {initServer} from 'web-engine'

var {app, container, router} = initServer()

app.listen(3000, () => {
    console.log('server started')
}) 

//...
```
Now add your stuff here...


## Adding your own services and routes:

Your services and routes are automatically scanned under `/src/routes` and `/src/services/` when initServer is being called.
see users.js and usersServices.js examples 

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
      
      async check(){

      }
  }
  ```

The parent service calls the child service during each healtcheck interval(localhost:3000/healthcheck), then returns true/false (via routing file) based on the child's healthcheck logic
  

  check function Response has bare the following format: 

  ``` {"status":"success"}```
  
  or , in case of error : 

  ``` {"status":"failure"}```


  * healthcheck docker installation
    
    Each microservice docer file needs to include the following command:


    ``` HEALTHCHECK --interval=30s --timeout=5s CMD curl --fail http://localhost:3000/healthcheck || exit 1 ```

* The helthcheck docker service is expected to get 200 or 500 http status response 


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


## Dependencies

* Koa2 - The returned app is a standard koa application, which can be used with middlewares as usual (see `https://www.npmjs.com/package/koa2`)
