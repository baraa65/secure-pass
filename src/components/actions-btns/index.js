import Delete from './delete'
import Logout from './logout'

export default (app) => {
	app.component('a-delete', Delete)
	app.component('a-logout', Logout)
}
