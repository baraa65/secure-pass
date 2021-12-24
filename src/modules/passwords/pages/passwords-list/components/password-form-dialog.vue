<template>
	<q-dialog v-model="show">
		<q-card style="width: 400px">
			<q-card-section>
				<q-form @submit="submit">
					<div class="q-pb-md">
						<a-input label="Title" v-model="form.title" />
					</div>
					<div class="q-pb-md">
						<a-input label="Username" v-model="form.username" />
					</div>
					<div class="q-pb-md">
						<a-input label="Password" v-model="form.password" />
					</div>
					<div class="q-pb-md">
						<a-input label="Description" v-model="form.desc" />
					</div>
					<div class="q-pb-md">
						<q-file dense filled v-model="file" label="Attachment">
							<template #prepend>
								<q-icon name="attach_file" />
							</template>
							<template #append v-if="file">
								<q-icon name="close" class="cursor-pointer" @click="file = null" />
							</template>
						</q-file>
					</div>

					<div class="row justify-end">
						<q-btn label="cancel" flat color="grey" class="q-mr-sm" @click="show = false" />
						<q-btn label="Submit" type="submit" color="primary" />
					</div>
				</q-form>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBase64 } from '../../../../../utils/files'
import { clientRSA } from '../../../../../utils/client-rsa'
const form = () => ({ title: '', username: '', password: '', desc: '' })

export default {
	name: 'password-form-dialog',
	props: {
		visible: { type: Boolean },
		password: Object,
	},
	data: () => ({ form: form(), file: null }),
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
		isEdit() {
			return !!this.password
		},
	},
	created() {
		this.$Socket.on('edit-password', (data) => {
			this.$notify(data)
			if (data.status != 200) return

			this.$emit('edit-password', data.data)
			this.show = false
		})
		this.$Socket.on('add-password', (data) => {
			this.$notify(data)
			if (data.status != 200) return

			this.$emit('create-password', data.data)
			this.show = false
		})
	},
	methods: {
		async formatForm() {
			let password = await clientRSA.enc({ password: this.form.password })

			return {
				...this.form,
				password,
				userId: this.user?.id,
				file: this.file ? await getBase64(this.file) : undefined,
			}
		},
		async submit() {
			if (this.isEdit)
				this.$Socket.emit('edit-password', {
					id: this.password.id,
					password: await this.formatForm(),
				})
			else this.$Socket.emit('add-password', { password: await this.formatForm() })
		},
		resetForm() {
			this.form = form()
			this.file = null
		},
	},
	watch: {
		password: {
			handler(val) {
				if (val) this.form = JSON.parse(JSON.stringify(val))
			},
			immediate: true,
		},
	},
}
</script>
