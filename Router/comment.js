const express = require("express");
const router = express.Router();

const AuthoController = require('../Controllers/Comment.Controllers');
const JWT_HEADER = require('../helpers/jwt_helpers');

router.post('/create-commnet', JWT_HEADER.verifyAccessToken, AuthoController.POST_COMMENTS)
router.get('/get-comments', AuthoController.GET_ID_PRODUCTS);
router.delete('/delete-comments', JWT_HEADER.verifyAccessToken, AuthoController.DELETE_ID_COMMENT);
router.get('/history-comments', JWT_HEADER.verifyAccessToken, AuthoController.HISTORY_COMMENT);

module.exports = router;