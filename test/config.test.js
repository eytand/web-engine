import { initServer } from '../index'
import { expect } from 'chai'
/*eslint-disable */
var server ,container
/*eslint-enable */

describe('configuration', () => {
	before(() => {
		server = initServer(true)
		container = server.container
	})
	it('can read default non overriden values from config', () => {
		expect(container.cradle.configService.get('key2')).to.equal('val2')
	})

})
