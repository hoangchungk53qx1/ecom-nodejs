const express = require("express");
const router = express.Router();

const upload = require('../multer');
const { verifyAccessToken } = require('../helpers/jwt_helpers');
const AuthoController = require('../Controllers/Products.Controllers');

router.get("/get-product", AuthoController.GET_PRODUCTS);
router.get("/type", AuthoController.TYPES_PRODUCT);
router.get("/search", AuthoController.FORM_SEARCH)
router.post("/add-product", upload.array('poster'), verifyAccessToken, AuthoController.ADD_PRODUCTS);
router.get("/get-one-product", AuthoController.GET_ID);
router.get('/:key/:NSX', AuthoController.NSX);
router.get("/updata-product", AuthoController.UPDATED_ID);
router.delete("/delete-product", verifyAccessToken, AuthoController.DELETE_ID);

module.exports = router;
