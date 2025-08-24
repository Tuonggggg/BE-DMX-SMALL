const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description } =
      newProduct
    try {
      const checkProduct = await Product.findOne({ name })
      if (checkProduct) {
        return resolve({
          status: "ERROR",
          message: "Name product is already exists",
        });
      }
      const createdProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
      });
      resolve({
        status: "OK",
        message: "Product created successfully",
        data: createdProduct,
      });
    } catch (error) {
      reject(error);
    }
  });
}

const updateProduct = (productId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(productId);
      if (!checkProduct) {
        return resolve({
          status: "ERROR",
          message: "Product not found",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(productId, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "Update success",
        data: updatedProduct,
      });
    } catch (error) {
      reject(error);
    }
  });
}

const deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(productId)
      if (!checkProduct) {
        return resolve({
          status: 'ERROR',
          message: 'Product not found'
        })
      }

      await Product.findByIdAndDelete(productId)

      resolve({
        status: 'OK',
        message: 'Delete product success'
      })
    } catch (error) {
      reject(error)
    }
  })
}

const getAllProduct = async () => {
  try {
    const allProduct = await Product.find()
    return {
      status: 'OK',
      message: 'Get all product success',
      data: allProduct
    }
  } catch (error) {
    throw error
  }
}

const getDetailsProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId)
      if (!product) {
        return resolve({
          status: 'ERROR',
          message: 'Product not found'
        })
      }
      resolve({
        status: 'OK',
        message: 'Get details product success',
        data: product
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailsProduct
}
