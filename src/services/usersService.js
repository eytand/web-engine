/**
 * This class is an example injected service.
 */
export default class UsersService {
	get(id) {
		return {
			id,
			user: 'foo'
		}
	}
	create(body) {
		let ret = Object.assign({id: '12345'}, body)
		return ret
	}
}