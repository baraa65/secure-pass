import { UserStorage } from '../../storage/user'

export default {
	path: '/auth',
	component: () => import('./layout'),
	beforeEnter(to, from, next) {
		let user = UserStorage.get()

		if (!user) next()
		else next('/')
	},
	children: [
		{
			path: 'login',
			component: () => import('./pages/login'),
		},
		{
			path: 'register',
			component: () => import('./pages/register'),
		},
	],
}
