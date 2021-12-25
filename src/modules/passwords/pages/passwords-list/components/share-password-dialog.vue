<template>
	<q-dialog v-model="show">
		<q-card style="width: 400px">
			<q-card-section>
				<q-form @submit="submit">
					<div class="q-pb-md">
						<user-select v-model="selectedUser" />
					</div>

					<div class="row justify-end">
						<q-btn label="cancel" flat color="grey" class="q-mr-sm" @click="show = false" />
						<q-btn label="Share" type="submit" color="primary" />
					</div>
				</q-form>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { ClientRSA, clientRSA } from '../../../../../utils/client-rsa'
import UserSelect from '../../../components/user-select'
const form = () => ({ title: '', username: '', password: '', desc: '' })

export default {
	name: 'share-password-dialog',
	components: { UserSelect },
	props: {
		visible: { type: Boolean },
		password: Object,
	},
	data: () => ({ form: form(), selectedUser: null }),
	computed: {
		...mapGetters('User', ['user']),
		show: {
			get() {
				return this.visible
			},
			set(val) {
				if (!val) {
					this.resetForm()
					this.$emit('close')
				}
			},
		},
	},
	created() {
		this.$Socket.on('share-password', (data) => {
			this.$notify(data)
			if (data.status != 200) return
			this.show = false
		})
	},
	methods: {
		async formatForm() {
			let password = (await clientRSA.dec(this.password.password))?.password
			let content = { password }

			let rsa = new ClientRSA()
			rsa.setPublicKey(this.selectedUser.publicKey)

			content = await rsa.enc(content)
			let signature = await clientRSA.sign(content)

			return {
				passwordId: this.password.id,
				receiverId: this.selectedUser.id,
				senderId: this.user.id,
				content,
				signature,
			}
		},
		async submit() {
			this.$Socket.emit('share-password', { sharedPassword: await this.formatForm() })
		},
		resetForm() {
			this.form = form()
			this.file = null
		},
	},
	watch: {},
}
</script>
