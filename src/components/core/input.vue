<template>
	<q-input class="a-input" dense filled rounded v-bind="$attrs" />
</template>

<script>
export default {
	name: 'a-input',
}
</script>

<style lang="scss" scoped>
.a-input {
	&::v-deep {
		.q-field__control {
			border-radius: 12px;
		}
		.q-field__control:after {
			width: calc(100% - 18px);
			margin-left: 9px;
		}
	}
}
</style>
