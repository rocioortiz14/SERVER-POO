const { Router } = require("express"); /*exportar Router */
const { check } = require("express-validator");
const { /* manejar las solicitudes HTTP relacionadas con los detalles de la factura*/
    getDetailInvoice,
    getDetailInvoiceById,
    createDetailInvoice,
    updateDetailInvoice,
    deleteDetailInvoice,
} = require("../controllers/detailInvoice.controller");
const {  /* manejar las solicitudes HTTP relacionadas con los detalles de detalle factura*/
  productExistById, 
  detailInvoiceExistById,
  invoiceExistById,
} = require("../helpers/db-validators"); /* importando funciones de validación  */
const { validateJWT, validateFields, isAdminRole } = require("../middleware");

const router = Router();

router.get("/", getDetailInvoice);

router.get( /*para validar los datos recibidos */
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(detailInvoiceExistById),
    validateFields,
  ],
  getDetailInvoiceById
);

router.post( /* validar los datos recibidos en la solicitud POST */
  "/",
  [
    check("product", "product is mandatory").not().isEmpty(),
    check("product", "is not a mongoID").isMongoId(),
    check("product").custom(productExistById),
    check("invoice", "product is mandatory").not().isEmpty(),
    check("invoice", "is not a mongoID").isMongoId(),
    check("invoice").custom(invoiceExistById),
    check("productUnit", "PrecioUnit is mandatory and Product unit must be between 1 and 7").isInt({ min: 1, max: 7 }).not().isEmpty(),

    validateJWT,
    validateFields,
  ],
  createDetailInvoice
);

router.put(/* actualizar los datos */
  "/:id",
  [
    validateJWT,
    check("status", "El estado es obligatorio").not().isEmpty(),
    check("product", "El producto es obligatorio").not().isEmpty(),
    check("product", "El ID del producto debe ser un ID de Mongo válido").isMongoId(),
    check("product").custom(productExistById),
    check("invoice", "La factura es obligatoria").not().isEmpty(),
    check("invoice", "El ID de la factura debe ser un ID de Mongo válido").isMongoId(),
    check("productUnit", "La cantidad de productos es obligatoria y debe ser un número entero").isInt({min: 1}),
    validateFields,
  ],
  updateDetailInvoice 
);

router.delete( /* eliminar datos */
  "/:id",
  [
    validateJWT,
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(detailInvoiceExistById),
    validateFields,
  ],
  deleteDetailInvoice
);


module.exports = router;
