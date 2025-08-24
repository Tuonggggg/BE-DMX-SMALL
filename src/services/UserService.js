const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService')

const createUser = async (newUser) => {
  try {
    const { name, email, password, phone } = newUser

    // check email đã tồn tại
    const checkUser = await User.findOne({ email })
    if (checkUser) {
      return {
        status: 'ERROR',
        message: 'Email already exists'
      }
    }

    // hash password
    const hash = bcrypt.hashSync(password, 10)

    // tạo user
    const createdUser = await User.create({
      name,
      email,
      password: hash,
      phone
    })

    return {
      status: 'OK',
      message: 'User created successfully',
      data: createdUser
    }
  } catch (error) {
    return {
      status: 'ERROR',
      message: error.message
    }
  }
}

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin
    try {
      const checkUser = await User.findOne({ email })
      if (!checkUser) {
        return resolve({
          status: 'ERROR',
          message: 'User not found'
        })
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password)
      if (!comparePassword) {
        return resolve({
          status: 'ERROR',
          message: 'Password is incorrect'
        })
      }

      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin
      })
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin
      })

      resolve({
        status: 'OK',
        message: 'Login successful',
        access_token,
        refresh_token
      })
    } catch (error) {
      reject(error)
    }
  })
}

const updateUser = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(userId)
      if (!checkUser) {
        return resolve({
          status: 'ERROR',
          message: 'User not found'
        })
      }
      if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10)
      }

      const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true })

      resolve({
        status: 'OK',
        message: 'Update success',
        data: updatedUser
      })
    } catch (error) {
      reject(error)
    }
  })
}

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(userId)
      if (!checkUser) {
        return resolve({
          status: 'ERROR',
          message: 'User not found'
        })
      }

      await User.findByIdAndDelete(userId)

      resolve({
        status: 'OK',
        message: 'Delete user success'
      })
    } catch (error) {
      reject(error)
    }
  })
}

const getAllUser = async () => {
  try {
    const allUser = await User.find()
    return {
      status: 'OK',
      message: 'Get all user success',
      data: allUser
    }
  } catch (error) {
    throw error
  }
}

const getDetailsUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId)
      if (!user) {
        return resolve({
          status: 'ERROR',
          message: 'User not found'
        })
      }
      resolve({
        status: 'OK',
        message: 'Get details user success',
        data: user
      })
    } catch (error) {
      reject(error)
    }
  })
}


module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser
}
