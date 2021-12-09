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
const form = () => ({ title: '', username: '', password: '', desc: '' })

export default {
	name: 'password-form-dialog',
	props: {
		visible: { type: Boolean },
		password: Object,
	},
	data: () => ({
		form: form(),
	}),
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
		formatForm() {
			return {
				...this.form,
				userId: this.user?.id,
			}
		},
		submit() {
			if (this.isEdit) this.$Socket.emit('edit-password', { id: this.password.id, password: this.formatForm() })
			else this.$Socket.emit('add-password', { password: this.formatForm() })
		},
		resetForm() {
			this.form = form()
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
