import Input from './input'
import PasswordField from './password-field'

export default (app) => {
	app.component('a-input', Input)
	app.component('a-password-field', PasswordField)
}
