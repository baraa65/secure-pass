import PasswordsRoutes from '../modules/passwords/routes'
import AuthRoutes from '../modules/auth/routes'

const routes = [
	PasswordsRoutes,
	AuthRoutes,

	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/Error404.vue'),
	},
]

export default routes
