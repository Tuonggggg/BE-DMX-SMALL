const ProductService = require('../services/ProductService')

const createProduct = async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, description } = req.body
    console.log('req.body:', req.body)

    if (!name || !image || !type || !price || !countInStock || !rating || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      })
    }

    const result = await ProductService.createProduct(req.body)
    console.log('🚀 ~ createProduct ~ result:', result)

    return res.status(201).json(result)
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

const updateProduct = async(req, res) => {
  try {
    const productId = req.params.id
    const data = req.body
    if(!productId) {
      return res.status(400).json({
        status: 'error',
        message: 'The productId is required'
      })
    }
    const result = await ProductService.updateProduct(productId, data)
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}

const deleteProduct = async(req, res) => {
  try {
    const productId = req.params.id
    if(!productId) {
      return res.status(400).json({
        status: 'error',
        message: 'The productId is required'
      })
    }
    const result = await ProductService.deleteProduct(productId)
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}

const getDetailsProduct = async(req, res) => {
  try {
    const productId = req.params.id
    if(!productId) {
      return res.status(400).json({
        status: 'error',
        message: 'The productId is required'
      })
    }
    const result = await ProductService.getDetailsProduct(productId)
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}

const getAllProduct = async(req, res) => {
  try {
    const result = await ProductService.getAllProduct()
    return res.status(200).json(result)
  } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getDetailsProduct,
  getAllProduct
}
