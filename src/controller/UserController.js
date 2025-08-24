const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async(req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body
    const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const isCheckEmail = reg.test(email)
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      })
    } else if (!isCheckEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      })
    } else if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match'
      })
    }
    console.log(isCheckEmail, 'isCheckEmail')
    const result = await UserService.createUser(req.body)
    return res.status(200).json(result)
  } catch (error) {
      return res.status(404).json({
        message: error
      })
  }
}

const loginUser = async(req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      })
    }

    const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const isCheckEmail = reg.test(email)
    if (!isCheckEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      })
    }

    const result = await UserService.loginUser(email, password)
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}

const updateUser = async(req, res) => {
  try {
    const userId = req.params.id
    const data = req.body
    if(!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'The userId is required'
      })
    }
    const result = await UserService.updateUser(userId, data)
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}

const deleteUser = async(req, res) => {
  try {
    const userId = req.params.id
    if(!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'The userId is required'
      })
    }
    const result = await UserService.deleteUser(userId)
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}

const getAllUser = async(req, res) => {
  try {
    const result = await UserService.getAllUser()
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}

const getDetailsUser = async(req, res) => {
  try {
    const userId = req.params.id
    if(!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'The userId is required'
      })
    }
    const result = await UserService.getDetailsUser(userId)
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}

const refreshToken = async(req, res) => {
  try {
    const token = req.headers.token.split(' ')[1]
    if(!token) {
      return res.status(400).json({
        status: 'error',
        message: 'The token is required'
      })
    }
    const result = await JwtService.refreshTokenJwtService(token) 
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}


module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken
}