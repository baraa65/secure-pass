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
							Don't have an account? <router-link to="/auth/register" class="n-link">SIGN UP</router-link>
						</div>
						<div>
							<q-btn label="Login" color="primary" class="full-width" type="submit" />
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

export default {
	data: () => ({ form: { username: '', password: '' } }),
	created() {
		this.$Socket.on('login', (data) => {
			this.$notify(data)
			if (data.status != 200) return

			UserStorage.set(data.data)
			this.setUser(data.data)

			setTimeout(() => {
				this.$router.push('/')
			}, 1000)
		})
	},
	methods: {
		...mapMutations('User', ['setUser']),
		submit() {
			this.$Socket.emit('login', { user: this.form })
		},
	},
	beforeRouteLeave(_, __, next) {
		this.$socket.off('login')

		next()
	},
}
</script>
