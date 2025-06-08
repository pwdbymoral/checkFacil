import express from 'express';
import { verificarTokenJWT } from '../middleware/validarReqAuth.js';
import * as festaController from '../controllers/festaController.js';
const router = express.Router();



router.post('/criar-festa', verificarTokenJWT, festaController.criarFesta);


router.get('/listar-festas', verificarTokenJWT, festaController.buscarFestas);


router.patch(
  '/:idFesta', 
  verificarTokenJWT,
  festaController.atualizarFesta
);


router.delete(
  '/:idFesta', 
  verificarTokenJWT,
  festaController.deletarFesta
);


router.post(
  '/:idFesta/convidados',
  verificarTokenJWT,
  festaController.adicionarConvidado 
);

router.get(
  '/:idFesta/convidados',
  verificarTokenJWT, 
  festaController.listarConvidadosDaFesta 
);


export default router;
