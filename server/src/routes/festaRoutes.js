import express from 'express';
import * as festaController from '../controllers/festaController.js';
import { verificarTokenJWT } from '../middleware/validarReqAuth.js';

const router = express.Router();


// Todas as rotas estão protegidas e requerem autenticação via token JWT.


// Cria uma nova festa.
router.post(
  '/criar',
  verificarTokenJWT,
  festaController.criarFesta
);

// Buscar Festa por ID.
router.get(
    '/:idFesta',
    verificarTokenJWT,
    festaController.buscarFestaPorId
);


//  Busca/lista festas com base nas permissões e filtros de data.
router.get(
  '/listar',
  verificarTokenJWT,
  festaController.buscarFestas
);


// Atualiza uma festa específica.
router.patch(
  '/:idFesta',
  verificarTokenJWT,
  festaController.atualizarFesta
);


// Deleta uma festa específica.
router.delete(
  '/:idFesta',
  verificarTokenJWT,
  festaController.deletarFesta
);


// Adiciona um novo convidado a uma festa.
router.post(
  '/:idFesta/convidados',
  verificarTokenJWT,
  festaController.adicionarConvidado
);


// Lista todos os convidados de uma festa.
router.get(
  '/:idFesta/convidados',
  verificarTokenJWT,
  festaController.listarConvidadosDaFesta
);


// Busca convidados por nome dentro de uma festa (ex: ?nome=Pedro).
router.get(
  '/:idFesta/convidados/buscar',
  verificarTokenJWT,
  festaController.buscarConvidadosPorNome
);


//  Atualiza um convidado específico.
router.patch(
  '/:idFesta/convidados/:idConvidado',
  verificarTokenJWT,
  festaController.atualizarConvidado
);


// Deleta um convidado específico.
router.delete(
  '/:idFesta/convidados/:idConvidado',
  verificarTokenJWT,
  festaController.deletarConvidado
);


//Realiza o check-in de um convidado.
router.patch(
  '/:idFesta/convidados/:idConvidado/checkin',
  verificarTokenJWT,
  festaController.checkinConvidado
);


// Realiza o check-out de um convidado.
router.patch(
  '/:idFesta/convidados/:idConvidado/checkout',
  verificarTokenJWT,
  festaController.checkoutConvidado
);

// Busca um convidado específico por ID dentro de uma festa.
router.get(
  '/:idFesta/convidados/:idConvidado',
  verificarTokenJWT, 
  festaController.buscarConvidadoPorId 
);

export default router;
