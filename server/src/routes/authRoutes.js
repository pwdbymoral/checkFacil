import express from 'express';
import * as authController from '../controllers/authController.js';
import { validarLogin, validarRegistro } from '../middleware/validarReqAuth.js';

const router = express.Router();

router.post('/register/convidado', validarRegistro, authController.registrarConvidado);

router.post('/register/admEspaco', validarRegistro, authController.registrarAdmEspaco);

router.post('/register/admFesta', validarRegistro, authController.registrarAdmFesta);
router.post('/register/admEspaco', validarRegistro, authController.registrarAdmEspaco);

router.post('/login', validarLogin, authController.login);

export default router;
