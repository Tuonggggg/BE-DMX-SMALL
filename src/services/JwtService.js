const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const genneralAccessToken = async (payload) => {
  const access_token = jwt.sign({
    payload
  }, process.env.ACCESS_TOKEN, { expiresIn: '30m' })
  return access_token
}

const genneralRefreshToken = async (payload) => {
  const refresh_token = jwt.sign({
    payload
  }, process.env.REFRESH_TOKEN, { expiresIn: '30d' })
  return refresh_token
}

const refreshTokenJwtService = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if(err || !user) {
          resolve ({
            status:  'ERROR',
            message: 'The authemtication'
          })
        }
        console.log('user', user)
        const { payload } = user
        const access_token = await genneralAccessToken({
          id: payload?.id,
          isAdmin: payload?.isAdmin
        })
        resolve({
          status: 'OK',
          message: 'Access token refreshed successfully',
          access_token
        })
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJwtService
}
