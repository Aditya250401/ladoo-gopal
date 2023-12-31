const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token
	if (!token) {
		throw new CustomError.UnauthenticatedError(
			'Authentication invalid no token'
		)
	}
	try {
		const { name, id, role } = isTokenValid({ token })
		req.user = { name, id, role }
		next()
	} catch (error) {
		throw new CustomError.UnauthenticatedError(
			'Authentication invalid token invalid'
		)
	}
}

const authorizePermisions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthorizedError('Unauthorized')
		}
		next()
	}
}

module.exports = { authenticateUser, authorizePermisions }
