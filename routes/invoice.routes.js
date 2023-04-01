const { Router } = require("express");
const { check } = require("express-validator");
const {
    getInvoice,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
} = require("../controllers/invoice.controller");
const {
  invoiceExistById,
  userByIdExist, //Me fue al helper validator a agregar esta validacion
  //categoryExistById,
} = require("../helpers/db-validators"); //aqui TODO 
const { validateJWT, validateFields, isAdminRole } = require("../middleware");//aqui

const router = Router();

router.get("/", getInvoice);

//part 1
router.get(
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(invoiceExistById),
    validateFields,
  ],
  getInvoiceById
);


//part 2
router.post(
  "/",
  [
    check("user", "user is mandatory").not().isEmpty(),
    check("user", "is not a mongoID").isMongoId(),
    check("user").custom(userByIdExist),
   // check("name", "name is mandatory").not().isEmpty(), //aqui no se que hice
    validateJWT,
    validateFields,
  ],
  createInvoice
);

//part 3

router.put( //modifique qui
  [
    validateJWT,
    check("name", "name is mandatory").not().isEmpty(),
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(invoiceExistById),
    validateFields,
  ],
  updateInvoice
);

//part 4

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(invoiceExistById),
    validateFields,
  ],
  deleteInvoice
);

module.exports = router;
