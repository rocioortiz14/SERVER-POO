const { response, request } = require("express");
const { Product } = require("../models");

const getProducts = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("user", "name")
      .populate("category", "name")
      .skip(from)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    total,
    products,
  });
};

const getProductById = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.status(200).json(product);
};

const createProduct = async (req, res = response) => {
  const { status, user, ...body } = req.body;

  const productDB = await Product.findOne({ name: body.name });

  if (productDB)
    return res
      .status(400)
      .json({ msg: `the product ${productDB.name} already exists` });

  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user._id,
    precio: body.precio,
  };

  const product = new Product(data);
  await product.save();
  res.status(200).json(product);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json(product);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  res.json(deletedProduct);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
