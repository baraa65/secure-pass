<template>
	<q-btn flat color="grey" icon="logout" @click="logout">
		<q-tooltip>Logout</q-tooltip>
	</q-btn>
</template>

<script>
import { UserStorage } from '../../storage/user'

export default {
	methods: {
		logout() {
			UserStorage.clear()
			this.$router.push('/auth/login')
		},
	},
}
</script>
