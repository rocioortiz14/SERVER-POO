const { Schema, model } = require("mongoose"); /*importanto modulos*/

const DetailInvoiceSchema = Schema({ /*efine el esquema para la colección */
 
  status: { /* registro activo o no */
    type: Boolean,
    default: true,
    required: true,
  },
  product: { /* Campo que referencia el id del producto */
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  invoice: { /*  Campo que referencia el id de la factura asociada  */
    type: Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  productUnit: { /*Campo que indica la cantidad del producto asociado */
    type: Number,
    default: 0,
  },
  
  precioTotal: { /* Campo que indica el precio total del producto*/
    type: Number,
    default: 0,
  },

});

DetailInvoiceSchema.methods.toJSON = function () { /* Asegurar que solo se incluyan los datos relevantes */
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("DetailInvoice", DetailInvoiceSchema); /* exporta el modelo */