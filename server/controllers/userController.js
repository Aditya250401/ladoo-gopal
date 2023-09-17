const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {
	attachCookiesToResponse,
	createTokenUser,
	checkPermissions,
} = require('../utils')

const getAllUsersOnline = async (req, res) => {
	const user = req.user
	const users = await User.find({ online: True }).select('-password')
	res
		.status(StatusCodes.OK)
		.json({ users, count: users.length, requester: user })
}

const getUser = async (req, res) => {
	const id = req.params.id
	const user = await User.findOne({ _id: id }).select('-password')
	if (!user) {
		res.status(StatusCodes.NOT_FOUND).json({ msg: `No user with id ${id}` })
	}
	checkPermissions(req.user, user._id)
	res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
	const user = req.user
	res.status(StatusCodes.OK).json({ user })
}

const updateUser = async (req, res) => {
	const { name, email } = req.body
	if (!name || !email) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'Please provide name and email' })
	}
	const user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{ name, email },
		{ new: true, runValidators: true }
	)

	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })

	res.status(StatusCodes.OK).json({ user: tokenUser })
}

const updateUserPassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body
	if (!currentPassword || !newPassword) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'Please provide current and new password' })
	}
	const user = await User.findOne({ _id: req.user.id })
	const isPasswordCorrect = await user.comparePassword(currentPassword)
	if (!isPasswordCorrect) {
		res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid password' })
	}
	user.password = newPassword
	await user.save()
	res.status(StatusCodes.OK).json({ msg: 'Password updated' })
}

module.exports = {
	getAllUsers,
	getUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
}
