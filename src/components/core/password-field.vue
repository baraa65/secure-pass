<template>
	<div class="row justify-between items-center" style="min-width: 70px; width: 120px">
		<div>{{ visible ? password : '●●●●●●●●●' }}</div>
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
export default {
	props: {
		password: String,
	},
	data: () => ({ visible: false }),
}
</script>
