const { Schema, model } = require("mongoose"); /* importando modelo */

const InvoiceSchema = Schema({ /* definir objeto usando constructor Schema */
  
  user: { /*  referencia al usuario que creó la factura */
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { /*  factura está activa o inactiva */
    type: Boolean,
    default: true,
    required: true,
  },
  total: { /*representa el total de la factura. */
    type: Number,
    default: 0,
  }

});

InvoiceSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject(); /*metodo utilizado para devolver una representación JSON */
  return data;
};

module.exports = model("Invoice", InvoiceSchema);  /*  exporta el modelo */