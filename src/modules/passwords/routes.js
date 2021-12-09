import { UserStorage } from '../../storage/user'

export default {
	path: '/',
	component: () => import('./layout'),
	beforeEnter(to, from, next) {
		let user = UserStorage.get()

		if (user) next()
		else next('/auth/login')
	},
	children: [
		{
			path: '',
			component: () => import('./pages/passwords-list'),
		},
	],
}
