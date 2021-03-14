const express = require("express");
const router = express.Router();

const AuthoController = require('../Controllers/Cart.Controllers');
const JWT_HEADER = require('../helpers/jwt_helpers');

router.post('/add-cart', JWT_HEADER.verifyAccessToken,AuthoController.ADD_CART);
router.get('/get-cart', JWT_HEADER.verifyAccessToken, AuthoController.GET_CART);
router.put('/update-address', JWT_HEADER.verifyAccessToken, AuthoController.UPDATE_ADDRESS);
router.put('/update-status-order', JWT_HEADER.verifyAccessToken, AuthoController.STATUS_ORDER);

module.exports = router;