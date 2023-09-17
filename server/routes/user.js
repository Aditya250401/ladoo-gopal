const express = require('express')
const router = express.Router()
const {
	getAllUsers,
	getUser,
	updateUser,
	updateUserPassword,
	showCurrentUser,
} = require('../controllers/userController')
const {
	authenticateUser,
	authorizePermisions,
} = require('../middleware/authentication')

router
	.route('/')
	.get([authenticateUser, authorizePermisions('admin')], getAllUsers)

router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
router.route('/:id').get(getUser)

module.exports = router
