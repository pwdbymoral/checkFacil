const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validarLogin, validarRegistro } = require('../middleware/validarReqAuth');

router.post('/register/convidado', validarRegistro, authController.registrarConvidado);

router.post('/register/admEspaco', validarRegistro, authController.registrarAdmEspaco);

router.post('/register/admFesta', validarRegistro, authController.registrarAdmFesta);
router.post('/register/admEspaco', validarRegistro, authController.registrarAdmEspaco);

router.post('/login', validarLogin, authController.login);

module.exports = router;
