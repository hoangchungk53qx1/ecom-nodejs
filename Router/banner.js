const express = require("express");
const router = express.Router();

const AuthoController = require('../Controllers/Banner.Contrllers');
const upload = require('../multer');
const { verifyAccessToken } = require('../helpers/jwt_helpers');

router.get('/get-banner', AuthoController.GET_BANNER);
router.post('/add-banner', upload.array('banner'), verifyAccessToken, AuthoController.ADD_BANNERS);
router.delete('/delete-banner', verifyAccessToken,AuthoController.DELETE_BANNER);

module.exports = router;