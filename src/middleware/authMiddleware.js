const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleware = (req, res, next) => {
  try {
    // Ưu tiên Authorization header, fallback sang 'token'
    const authHeader = req.headers['authorization'] || req.headers['token']
    if (!authHeader) {
      return res.status(401).json({ status: 'ERROR', message: 'No token provided' })
    }

    // Lấy chuỗi sau khoảng trắng (dù là 'Bearer', 'Beare', hay thiếu cũng vẫn tách)
    const parts = String(authHeader).trim().split(' ')
    const token = parts.length === 2 ? parts[1] : parts[0]
    if (!token) {
      return res.status(401).json({ status: 'ERROR', message: 'Token missing' })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ status: 'ERROR', message: 'Invalid or expired token' })
      }

      // Hỗ trợ cả 2 kiểu payload: { payload: { id, isAdmin } } hoặc { id, isAdmin }
      const info = decoded?.payload || decoded
      if (!info) {
        return res.status(403).json({ status: 'ERROR', message: 'Malformed token payload' })
      }

      req.user = info // { id, isAdmin }

      if (!req.user.isAdmin) {
        return res.status(403).json({ status: 'ERROR', message: 'Not allowed' })
      }

      return next()
    })
  } catch (e) {
    return res.status(500).json({ status: 'ERROR', message: e.message })
  }
}

// Middleware cho user → tự xem thông tin của mình, hoặc admin xem hộ
const authUserMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['token']
    if (!authHeader) {
      return res.status(401).json({ status: 'ERROR', message: 'No token provided' })
    }

    const parts = String(authHeader).trim().split(' ')
    const token = parts.length === 2 ? parts[1] : parts[0]
    const userId = req.params.id

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ status: 'ERROR', message: 'Invalid or expired token' })
      }

      const info = decoded?.payload || decoded
      req.user = info

      // Cho phép nếu: là chính user đó, hoặc là admin
      if (req.user.id === userId || req.user.isAdmin) {
        return next()
      }

      return res.status(403).json({ status: 'ERROR', message: 'Not allowed' })
    })
  } catch (e) {
    return res.status(500).json({ status: 'ERROR', message: e.message })
  }
}

module.exports = { 
  authMiddleware,
  authUserMiddleware
 }
