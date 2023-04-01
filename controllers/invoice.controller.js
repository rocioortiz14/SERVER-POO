const { response, request } = require("express");/*importan los módulos*/
const { Invoice } = require("../models");/*importar el modelo de factura */

const getInvoice = async (req, res = response) => { /* función asincrónica con parametros*/
  const { limit = 5, from = 0 } = req.query;  /*xtraer los valores limit y from del objeto*/
  const query = { status: true };
  const [invoice] = await Promise.all([ /*asignando resultados a variables detailinvoice y total*/
    Invoice.find(query)
      .populate("user", "name")/*especifican la colección que se va a reemplazar*/
    
      .skip(from)
      .limit(limit),
    Invoice.countDocuments(query),
  ]);

  res.status(200).json({/*respuesta HTTP con un estado de 200 y un objeto JSON */
    invoice,
  });
};

const getInvoiceById = async (req = request, res = response) => { /* desestructuración para extraer el parámetro id del objeto params que se pasa en la solicitud  */
  const { id } = req.params; /*extraer el ID de la factura detallada de los parámetros de la solicitud*/
  const invoice = await Invoice.findById(id)/* buscar la factura detallada en la base de datos*/
    .populate("user", "name") /*especifican la colección que se va a reemplazar*/


  res.status(200).json(invoice);
};



const createInvoice = async (req, res = response) => {  /* Se extraen del cuerpo de la solicitud el estado y el usuario, y se guarda el resto de la información */
  const { status, user, ...body } = req.body;

  const invoiceDB = await Invoice.findOne({ name: body.name }); /* Se realiza una búsqueda en la base de datos para ver si ya existe una factura con el mismo nombre*/


  if (invoiceDB)   /*Si la factura ya existe, se devuelve un mensaje de error.*/
    return res
      .status(400)
      .json({ msg: `the invoice ${invoiceDB.name} already exists` });
  const data = { /* Se crea un objeto con la información de la factura a guardar, incluyendo el ID del usuario que creó la factura.*/
    ...body,
    user: req.user._id,
  };
  const invoice = new Invoice(data); /* Se crea una nueva instancia del modelo Invoice con los datos de la factura y se guarda en la base de datos */
  await invoice.save();
  res.status(200).json(invoice);  /* Se devuelve la factura creada en la respuesta de la solicitud.*/

};



const updateInvoice = async (req, res) => {/* solicitud HTTP entrante y salida */
  const { id } = req.params; /*ID de la factura se extrae */
  const { status, user, ...data } = req.body; /* Se desestructura la solicitud recibida para obtener status y user y el resto de informacion*/

  data.user = req.user._id; /*indicar que la factura fue creada por el usuario autenticado.*/

  const invoice = await Invoice.findByIdAndUpdate(id, data, { new: true }); /*actualizar la información de la factura en la base de datos */

  res.json(invoice); /* resultado de la actualización se envía como respuesta en formato JSON */
};



const deleteInvoice= async (req, res) => { /* solicitud HTTP entrante y salida */
  const { id } = req.params; /* se extrae el parámetro id del objeto params */
  const deletedInvoice = await Invoice.findByIdAndUpdate( /*llama al método*/
    id,
    { status: false },
    { new: true }
  );
  res.json(deletedInvoice); /*respuesta en formato JSON*/
};

module.exports = { /*exportando objeto utilizarán para manejar las rutas relacionadas*/
  getInvoice,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
