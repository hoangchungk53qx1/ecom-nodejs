const express = require("express");
const router = express.Router();

const AuthoController = require('../Controllers/Admin.Contrllers');
const { verifyAccessToken } = require('../helpers/jwt_helpers');

router.post('/login', AuthoController.LOGIN);
router.get('/profile', verifyAccessToken, AuthoController.PROFILE);
router.get('/get-all-user', verifyAccessToken, AuthoController.GET_ALL_USER);
router.post('/check-out-card', verifyAccessToken, AuthoController.CHECK_OUT_CARD);
router.get('/list-card', AuthoController.LIST_CARD);

module.exports = router;