import { UserStorage } from '../../storage/user'

let user = UserStorage.get()

export default {
	namespaced: true,
	state: { user },
	getters: {
		user: (s) => s.user || {},
	},
	mutations: {
		setUser(state, val) {
			state.user = val
		},
	},
}
