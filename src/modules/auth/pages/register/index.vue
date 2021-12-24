<template>
	<div class="bg-primary" style="height: 100vh">
		<div class="flex flex-center full-height">
			<q-card style="width: 300px">
				<q-card-section>
					<q-form @submit="submit">
						<div class="q-pb-md">
							<a-input label="Username" v-model="form.username" />
						</div>
						<div class="q-pb-md">
							<a-input label="Password" type="password" v-model="form.password" />
						</div>
						<div class="text-grey text-caption q-pb-md q-px-xs">
							Already have an account? <router-link to="/auth/login" class="n-link">SIGN IN</router-link>
						</div>
						<div>
							<q-btn label="Register" color="primary" class="full-width" type="submit" />
						</div>
					</q-form>
				</q-card-section>
			</q-card>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex'
import { UserStorage } from '../../../../storage/user'
import { clientRSA } from '../../../../utils/client-rsa'
import { KeyPairStorage } from '../../../../storage/private-key'

export default {
	data: () => ({ form: { username: '', password: '' } }),
	created() {
		this.$Socket.on('register', (data) => {
			this.$notify(data)
			if (data.status != 200) return
			UserStorage.set(data.data)
			this.setUser(data.data)
			this.$router.push('/')
		})
	},
	methods: {
		...mapMutations('User', ['setUser']),
		async submit() {
			let keyPair = await clientRSA.generateKeys()

			KeyPairStorage.set(this.form.username, keyPair)

			this.$Socket.emit('register', {
				user: {
					...this.form,
					publicKey: keyPair.encryption.publicKey,
					signingPublicKey: keyPair.signing.publicKey,
				},
			})
		},
	},
	beforeRouteLeave(_, __, next) {
		this.$socket.off('register')

		next()
	},
}
</script>
