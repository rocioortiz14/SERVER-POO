const Category = require("./category.model");
const Role = require("./role.model");
const Server = require("./server");
const User = require("./user.model");
const Product = require("./product.model");
const Invoice = require("./invoice.model"); //Agrefgamos la referencia a model
const DetailInvoice = require("./detailInvoice.model");

module.exports = {
  Category,
  Role,
  Server,
  User,
  Product,
  Invoice, //Lo exportamos
  DetailInvoice
   //agregue aqui
};
