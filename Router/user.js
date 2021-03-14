const express = require("express");
const router = express.Router();

const AuthoController = require('../Controllers/User.Controllers');
const upload = require('../multer');
const { verifyAccessToken } = require('../helpers/jwt_helpers');

router.post('/register', AuthoController.REGISTER)
router.post('/login', AuthoController.LOGIN)
router.get('/profile', verifyAccessToken, AuthoController.PROFILE)
router.post('/refresh-token', AuthoController.REFRESH_TOKEN)
router.put("/updata-image", upload.single('avatar'),verifyAccessToken, AuthoController.UPDATA_IMAGE_USER);
router.put("/updata-informaiton",verifyAccessToken, AuthoController.INFORMATION);

module.exports = router;
 