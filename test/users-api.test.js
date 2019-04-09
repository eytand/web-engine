import { apiHelper } from './api-helper'
import { expect } from 'chai'

describe('users API', () => {
	it('can create a user', async () => {
		const api = await apiHelper()
		const user = await api.createUser({
			name: 'foo',
			surename: 'bar'
		})
		console.log(`created user is ${user}`)
		expect(user.id).not.to.be.null
		expect(user.bla).to.be.undefined
		expect(user).to.include(
			{
				name: 'foo',
				surename: 'bar'
			}
		)
	})

	it('can get a user by id', async () => {
		let expected = {
			id: '123456',
			user: 'foo'
		}

		const api = await apiHelper()
		const created = await api.getUser('123456')
		expect(expected).to.deep.equal(created)
	})


})