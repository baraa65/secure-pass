<template>
	<q-select label="User" dense filled v-model="selectedUser" :options="users" option-label="username" option-value="id" />
</template>

<script>
export default {
	name: 'user-select',
	props: {
		value: Object,
	},
	data: () => ({ users: [] }),
	computed: {
		selectedUser: {
			get() {
				return this.value
			},
			set(val) {
				this.$emit('input', val)
			},
		},
	},
	created() {
		this.$Socket.on('users', (data) => {
			if (data.status != 200) return this.$notify(data)

			this.users = data.data
		})

		this.$Socket.emit('users')
	},
}
</script>
