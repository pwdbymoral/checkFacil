import express from 'express';
import * as authController from '../controllers/festaController.js';
import { verificarTokenJWT } from '../middleware/validarReqAuth.js';

const router = express.Router();

router.post('/criar-festa', verificarTokenJWT, authController.criarFesta);
router.get('/listar-festas', verificarTokenJWT, authController.buscarFestas);

export default router;
