const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name'],
		min: 3,
		max: 50,
	},
	email: {
		type: String,
		required: [true, 'Please provide a email'],
		validate: {
			validator: validator.isEmail,
			message: 'Please provide a valid email',
		},
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		min: 6,
		max: 50,
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
})
UserSchema.pre('save', async function () {
	if (!this.isModified('password')) return
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})
UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch
}

module.exports = mongoose.model('User', UserSchema)
