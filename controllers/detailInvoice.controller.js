
const { response, request } = require("express"); /*desestructuración para importar los objetos y modelos*/
const { DetailInvoice, Product,Invoice } = require("../models");



const getDetailInvoice = async (req, res = response) => {   /* función asincrónica con parametros*/
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true }; 
  /*ejecutar dos promesas a la vez*/ 
  const [detailinvoice, total] = await Promise.all([  /*asignando resultados a variables detailinvoice y total*/
    DetailInvoice.find(query)
      .populate("product", "name") /*especifican la colección que se va a reemplazar*/
      .populate("invoice", "_id")
      .skip(from)
      .limit(limit),
    DetailInvoice.countDocuments(query),
  ]);
  res.status(200).json({/*respuesta HTTP con un estado de 200 y un objeto JSON */
    total,
    detailinvoice,
  });
};

/* función asincrónica con parametros*/
const getDetailInvoiceById = async (req = request, res = response) => {
  /* desestructuración para extraer el parámetro id del objeto params que se pasa en la solicitud  */
  const { id } = req.params;
  const detailInvoice = await DetailInvoice.findById(id)
    .populate("product", "name precio");
  if (!detailInvoice) {   /*Si no se encuentra un detalle de factura correspondiente al ID proporcionado, se devuelve una respuesta HTTP con un estado 404 y un objeto JSON */
    return res.status(404).json({ msg: `No detail invoice found with id ${id}` });
  }
  res.status(200).json(detailInvoice);/* respuesta HTTP con un estado 200 y un objeto JSON*/
};

/* función asincrónica con parametros*/
const createDetailInvoice = async (req, res = response) => {  /*datos de detalle de factura se extraen del cuerpo de la solicitud*/
  const { status,user,  product, invoice, productUnit, ...body } = req.body;
  const productDB = await Product.findById(product); /*Realiza una búsqueda en la base de datos utilizando el modelo Product y su método findById*/

 const existingDetailInvoice = await DetailInvoice /*búsqueda en la base de datos utilizando el modelo */
  .findOne({ product, invoice })
  .populate('product', 'name'); /*incluir los detalles del producto, */

  if (existingDetailInvoice) { /*Si se encuentra el detalle espuesta HTTP con un estado 400 y un objeto JSON*/
    return res.status(400).json({ msg: `The product ${existingDetailInvoice.product.name} is already in the invoice ${invoice}` });
  }

  if (!productDB) /*Si no se encuentra devuelve una respuesta HTTP con un estado 400 y un objeto JSON*/
    return res
      .status(400)
      .json({ msg: `the product  not already exists` });
  
  if (productUnit > 7) { /*Especificar un número de unidades superior a 7*/
    return res.status(400).json({ msg: `The maximum number of units is 7` });
  }

  const precioTotal = productDB.precio * productUnit ; /*calculo del precio total multiplicando el precio del producto */

  const detailInvoices = await DetailInvoice.find({ invoice }); /*busca en la base de datos los detalles de factura*/
  const distinctProducts = new Set(); /*obejto set vacio para almacenar los productos distintos que se han agregado a la factura*/
  let totalInvoice = 0; 


  detailInvoices.forEach(detailInvoice => {
    distinctProducts.add(detailInvoice.product.toString());
    totalInvoice += detailInvoice.precioTotal; 
  });
 
  if (distinctProducts.has(product)) { /*Comprueba si el producto que se está intentando agregar  ya se ha agregado a la factura*/
    return res.status(400).json({ msg: `The product ${product} has already been added to the invoice.` });
  }

  distinctProducts.add(product); /*Si el producto no se ha agregado previamente se agrega al conjunto */


  if (distinctProducts.size > 10) {
    return res.status(400).json({ msg: `Cannot add more than 10 distinct products to the invoice.` });
  }

  const data = { /* objeto data*/
    ...body,
  
    product, 
    invoice,
    user: req.user._id,
    productUnit,
    precioTotal,
  };

  const detailInvoice = new DetailInvoice(data);/* creando objeto*/
  await detailInvoice.save(); /*guardando objeto en la base*/

   
  const invoiceToUpdate = await Invoice.findById(invoice); /*busca la factura correspondiente en la colección de facturas*/
  invoiceToUpdate.total = totalInvoice + precioTotal; /*actualiza el total de la factura sumando el total anterior con el nuevo total*/ 
  await invoiceToUpdate.save();

  res.status(200).json(detailInvoice); /*respuesta HTTP con un estado de 200 */
};

const updateDetailInvoice = async (req, res) => { /* desestructuración para extraer el parámetro id */
  const { id } = req.params;
  const { status, user, product, invoice, productUnit, ...data } = req.body;
  const productDB = await Product.findById(product); /*Se realiza una consulta a la base de datos */

  const detailInvoice = await DetailInvoice.findById(id);/*consulta a la base de datos para encontrar el producto asociado*/
  if (!detailInvoice) {
    return res.status(404).json({ msg: `No existe el detalle de factura con el ID ${id}` }); /*mensaje de error con un estado de respuesta de 404 */
  }

  const precioTotal = productDB.precio * productUnit ; /*calculo del precio total*/

  /*actualizan las propiedades del detalle de factura con los valores proporcionados en el cuerpo de la solicitud*/
  detailInvoice.status = status ?? detailInvoice.status;
  detailInvoice.user = user ?? detailInvoice.user;
  detailInvoice.product = product ?? detailInvoice.product;
  detailInvoice.invoice = invoice ?? detailInvoice.invoice;
  detailInvoice.productUnit = productUnit ?? detailInvoice.productUnit;
  detailInvoice.precioTotal = precioTotal;                           

  await detailInvoice.save();

  res.status(200).json(detailInvoice);  /*respuesta HTTP con un estado de 200 */
};

const deleteDetailInvoice = async (req, res) => { 
  const { id } = req.params;/*extraer el ID de la factura detallada de los parámetros de la solicitud*/
  const detailInvoice = await DetailInvoice.findById(id); /* buscar la factura detallada en la base de datos*/
  if (!detailInvoice) {/* si no existe, devuelve una respuesta de error */
    return res.status(404).json({ msg: `Detail invoice with ID ${id} does not exist.` });
  }

  await DetailInvoice.findByIdAndDelete(id); /*eliminar la factura detallada de la base de datos*/

  res.json({ msg: "Detail invoice deleted successfully." }); /*devuelve una respuesta de éxito*/
};


module.exports = { /*exportando objetos con sus propiedades*/
  getDetailInvoice,
  getDetailInvoiceById,
  createDetailInvoice,
  updateDetailInvoice, 
  deleteDetailInvoice,
};
