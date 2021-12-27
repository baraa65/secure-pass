<template>
	<div class="q-px-xl">
		<div style="min-height: 400px">
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
					@request="onRequest"
				>
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
								<q-btn
									v-if="props.row.file"
									dense
									round
									flat
									color="blue"
									icon="download"
									@click="downloadAttachment(props.row)"
								>
									<q-tooltip> Download Attachment </q-tooltip>
								</q-btn>
								<q-btn dense round flat color="gray" icon="link" @click="share(props.row)">
									<q-tooltip> Share Password </q-tooltip>
								</q-btn>
							</div>
						</q-td>
					</template>
				</q-table>
			</div>
		</div>

		<div v-if="sharedPasswords.length">
			<div class="row items-center justify-between">
				<h4>Shared Passwords</h4>
			</div>
			<div>
				<q-table
					flat
					hide-pagination
					:rows="sharedPasswords"
					:pagination="{ rowsPerPage: 100 }"
					:columns="sharedPasswordsColumns"
					@request="onRequest"
				>
					<template #body-cell-password="props">
						<q-td :props="props">
							<div class="flex flex-center">
								<password-field :password="props.row.content" />
							</div>
						</q-td>
					</template>
					<template #body-cell-actions="props">
						<q-td width="150" :props="props" class="actions-column">
							<div class="flex no-wrap justify-center">
								<q-btn dense round flat color="positive" icon="check" @click="accept(props.row)">
									<q-tooltip> Accept </q-tooltip>
								</q-btn>
								<q-btn dense round flat color="red" icon="close" @click="reject(props.row)">
									<q-tooltip> Reject </q-tooltip>
								</q-btn>
							</div>
						</q-td>
					</template>
				</q-table>
			</div>
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

		<share-password-dialog
			:visible="sharedPasswordDialog"
			:password="selectedPassword"
			@close="sharedPasswordDialog = false"
		/>
	</div>
</template>

<script>
import { columns, sharedPasswordsColumns } from './static'
import PasswordFormDialog from './components/password-form-dialog'
import PasswordField from '../../../../components/core/password-field'
import { downloadBase64 } from '../../../../utils/files'
import SharePasswordDialog from './components/share-password-dialog'

export default {
	components: { SharePasswordDialog, PasswordField, PasswordFormDialog },
	data: () => ({
		passwords: [],
		sharedPasswords: [],
		selectedPassword: null,
		columns,
		sharedPasswordsColumns,
		passwordFormDialog: false,
		sharedPasswordDialog: false,
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
		this.$Socket.on('shared-passwords', (data) => {
			if (data.status != 200) return

			this.sharedPasswords = data.data
		})
		this.$Socket.on('accept-shared-password', (data) => {
			if (data.status != 200) return

			this.onRequest()
		})
		this.$Socket.on('reject-shared-password', (data) => {
			this.$notify(data)
			if (data.status != 200) return

			this.onRequest()
		})
	},
	mounted() {
		this.onRequest()
	},
	methods: {
		onRequest() {
			this.$Socket.emit('passwords')
			this.$Socket.emit('shared-passwords')
		},
		create() {
			this.selectedPassword = null
			this.passwordFormDialog = true
		},
		edit(password) {
			this.selectedPassword = password
			this.passwordFormDialog = true
		},
		del(password) {
			this.$Socket.emit('delete-password', { id: password.id })
		},
		downloadAttachment(password) {
			if (password.file) downloadBase64(password.file, password.title || 'No Title')
		},
		share(password) {
			this.selectedPassword = password
			this.sharedPasswordDialog = true
		},
		async accept(sharedPassword) {
			this.$Socket.emit('accept-shared-password', {
				password: sharedPassword.content,
				sharedPasswordId: sharedPassword.id,
			})
		},
		reject(sharedPassword) {
			this.$Socket.emit('reject-shared-password', { sharedPasswordId: sharedPassword.id })
		},
	},
	beforeRouteLeave(_, __, next) {
		this.$socket.off('passwords')
		this.$socket.off('delete-password')
		this.$socket.off('add-password')
		this.$socket.off('edit-password')

		next()
	},
}
</script>
