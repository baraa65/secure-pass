<template>
	<div class="q-px-xl">
		<div class="row items-center justify-between">
			<h4>Passwords</h4>

			<div>
				<a-logout />
			</div>
		</div>

		<div>
			<q-table
				flat
				hide-pagination
				:rows="passwords"
				:pagination="{ rowsPerPage: 100 }"
				:columns="columns"
				:loading="loading"
				@request="onRequest"
			>
				<template #body-cell-id="props">
					<q-td :props="props">
						{{ props.row.id }}
					</q-td>
				</template>
				<template #body-cell-password="props">
					<q-td :props="props">
						<div class="flex flex-center">
							<password-field :password="props.row.password" />
						</div>
					</q-td>
				</template>
				<template #body-cell-actions="props">
					<q-td width="150" :props="props" class="actions-column">
						<div class="flex no-wrap justify-center">
							<!--							<q-btn flat round dense icon="preview" @click="preview(props.row)">-->
							<!--								<q-tooltip> View </q-tooltip>-->
							<!--							</q-btn>-->
							<q-btn dense round flat color="positive" icon="create" @click="edit(props.row)">
								<q-tooltip> Edit </q-tooltip>
							</q-btn>
							<q-btn dense round flat color="red" icon="delete" @click="del(props.row)">
								<q-tooltip> Delete </q-tooltip>
							</q-btn>
						</div>
					</q-td>
				</template>
			</q-table>
		</div>

		<div class="fixed-bottom-right q-pa-md" style="z-index: 100">
			<q-btn rounded color="primary" icon="add" @click="create()" style="height: 50px; width: 50px" />
		</div>

		<password-form-dialog
			:visible="passwordFormDialog"
			:password="selectedPassword"
			@close="passwordFormDialog = false"
			@create-password="(p) => passwords.push(p)"
			@edit-password="(p) => (passwords = passwords.map((pa) => (pa.id == p.id ? p : pa)))"
		/>
	</div>
</template>

<script>
import { columns } from './static'
import PasswordFormDialog from './components/password-form-dialog'
import PasswordField from '../../../../components/core/password-field'

export default {
	components: { PasswordField, PasswordFormDialog },
	data: () => ({
		passwords: [],
		selectedPassword: null,
		columns,
		passwordFormDialog: false,
	}),
	created() {
		this.$Socket.on('passwords', (data) => {
			if (data.status != 200) {
				this.$notify(data)
				return
			}
			this.passwords = data.data
		})
		this.$Socket.on('delete-password', (data) => {
			this.$notify(data)
			if (data.status != 200) return

			this.passwords = this.passwords.filter((p) => p.id != data.data?.id)
		})
	},
	mounted() {
		this.onRequest()
	},
	methods: {
		onRequest() {
			this.$Socket.emit('passwords')
		},
		create() {
			this.selectedPassword = null
			this.passwordFormDialog = true
		},
		preview(password) {},
		edit(password) {
			this.selectedPassword = password
			this.passwordFormDialog = true
		},
		del(password) {
			this.$Socket.emit('delete-password', { id: password.id })
		},
	},
}
</script>