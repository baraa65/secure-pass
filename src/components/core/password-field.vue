<template>
	<div class="row justify-between items-center" style="min-width: 70px; width: 120px">
		<div>{{ visible ? extractedPassword : '●●●●●●●●●' }}</div>
		<q-icon
			:name="visible ? 'visibility_off' : 'visibility'"
			size="22px"
			color="grey-7"
			class="cursor-pointer"
			@click="visible = !visible"
		/>
	</div>
</template>

<script>
import { clientRSA } from '../../utils/client-rsa'

export default {
	props: {
		password: String,
	},
	data: () => ({ visible: false, extractedPassword: '' }),
	watch: {
		password: {
			async handler() {
				this.extractedPassword = (await clientRSA.dec(this.password))?.password
			},
			immediate: true,
		},
	},
}
</script>
