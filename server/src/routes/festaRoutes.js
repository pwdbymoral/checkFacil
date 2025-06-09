import express from 'express';


import * as festaController from '../controllers/festaController.js';
import { verificarTokenJWT } from '../middleware/validarReqAuth.js';

const router = express.Router();


// Todas as rotas estão protegidas e requerem autenticação via token JWT.

// Cria uma nova festa
router.post(
  '/criar', 
  verificarTokenJWT,
  festaController.criarFesta
);


// Busca/lista festas com base nas permissões e filtros de data
router.get(
  '/listar', 
  verificarTokenJWT,
  festaController.buscarFestas
);


// Atualiza uma festa específica
router.patch(
  '/:idFesta',
  verificarTokenJWT,
  festaController.atualizarFesta
);


// Deleta uma festa específica
router.delete(
  '/:idFesta',
  verificarTokenJWT,
  festaController.deletarFesta
);




// Adiciona um novo convidado a uma festa
router.post(
  '/:idFesta/convidados',
  verificarTokenJWT,
  festaController.adicionarConvidado
);


// Lista todos os convidados de uma festa
router.get(
  '/:idFesta/convidados',
  verificarTokenJWT,
  festaController.listarConvidadosDaFesta
);




// Busca convidados por nome dentro de uma festa específica (ex: ?nome=Pedro)
router.get(
  '/:idFesta/convidados/buscar',
  verificarTokenJWT,
  festaController.buscarConvidadosPorNome
);


//Atualiza um convidado específico
router.patch(
  '/:idFesta/convidados/:idConvidado',
  verificarTokenJWT,
  festaController.atualizarConvidado
);


// Deleta um convidado específico
router.delete(
  '/:idFesta/convidados/:idConvidado',
  verificarTokenJWT,
  festaController.deletarConvidado
);

router.patch(
  '/:idFesta/convidados/:idConvidado/checkin',
  verificarTokenJWT,
  festaController.checkinConvidado
);


router.patch(
  '/:idFesta/convidados/:idConvidado/checkout',
  verificarTokenJWT,
  festaController.checkoutConvidado
);

export default router;
