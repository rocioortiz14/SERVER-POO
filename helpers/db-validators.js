const { Category, Product, Invoice, DetailInvoice} = require("../models");
const Role = require("../models/role.model");
const User = require("../models/user.model");

const isAValidRole = async (role = "") => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist)
    throw new Error(`Role: ${role} is not registered in Database`);
};

const emailExist = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) throw new Error(`Email already exist in DB`);
};

const userByIdExist = async (id) => {
  const userExist = await User.findById(id);
  if (!userExist) throw new Error(`the Id does not exist`);
};

const categoryExistById = async (id) => {
  const categoryExist = await Category.findById(id);
  if (!categoryExist) throw new Error(`the category Id does not exist`);
};

const productExistById = async (id) => {
  const productExist = await Product.findById(id);
  if (!productExist) throw new Error(`the product Id does not exist`);
};
//ESTO HICE nosotros
const invoiceExistById = async (id) => {
  const invoiceExist = await Invoice.findById(id);
  if (!invoiceExist) throw new Error(`the Invoice Id does not exist`);
};

const detailInvoiceExistById = async (id) => {
  const detailInvoiceExist = await DetailInvoice.findById(id);
  if (!detailInvoiceExist) throw new Error(`the  Detail Invoice Id does not exist`);
};


const allowedCollections = async (collection = "", collections = []) => {
  const isIncluded = collections.includes(collection);
  if (!isIncluded)
    throw new Error(
      `La collection ${collection} is not allowed, ${collections}`
    );
  return true;
};

module.exports = {
  isAValidRole,
  emailExist,
  userByIdExist,
  categoryExistById,
  productExistById,
  invoiceExistById,
  detailInvoiceExistById,
  allowedCollections,
};
