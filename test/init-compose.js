
import { before, after } from 'mocha'
import { dockerComposeTool } from 'docker-compose-mocha'
import { resolve } from 'path'

const pathToCompose = resolve('./test/rabbit-compose.yml')
dockerComposeTool(before, after, pathToCompose)


