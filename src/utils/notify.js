import { Notify } from 'quasar'

export function $notify(data) {
	Notify.create({
		message: data?.msg,
		type: data.status > 300 ? 'negative' : 'positive',
		position: 'top-right',
	})
}
