import { boot } from 'quasar/wrappers'

import CoreComponents from 'src/components/core'
import ActionsBtns from 'src/components/actions-btns'
import Page from 'src/components/page'
import { $notify } from '../utils/notify'

export default boot(async ({ app }) => {
	app.component('a-page', Page)
	CoreComponents(app)
	ActionsBtns(app)
	app.config.globalProperties.$notify = $notify
})
