const productService = require('../services/product.service');

const createProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body);
    if (result?.error) {
      return res.status(400).json({ error: { message: result.error } });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: { message: "Product not found!" } });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const product = await productService.deleteProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: { message: "Product not found!" } });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

const updateProductById = async (req, res) => {
  try {
    const result = await productService.updateProductById(req.params.id, req.body);
    if (result?.error) {
      return res.status(result.error === "Product not found!" ? 404 : 400).json({ error: { message: result.error } });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Server Error: ", error);
    return res.status(500).json({ error: { message: "Server Error!" } });
  }
};

module.exports = {
  createProduct,
  updateProductById,
  getAllProducts,
  deleteProductById,
  getProductById
};