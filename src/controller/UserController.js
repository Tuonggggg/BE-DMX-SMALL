const UserService = require('../services/UserService')

const createUser =  async(req, res) => {
  try {
    console.log(req.body)
    const result = await UserService.createUser()
    return res.status(200).json(result)
  } catch (error) {
      return res.status(404).json({
        message: error
      })
  }
}

module.exports = {
  createUser
}