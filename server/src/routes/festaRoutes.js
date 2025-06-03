const express = require("express");
const router = express.Router();
const authController = require("../controllers/festaController");
const { verificarTokenJWT } = require("../middleware/validarReqAuth");

router.post("/criar-festa", verificarTokenJWT, authController.criarFesta);

router.get("/listar-festas", verificarTokenJWT, authController.buscarFestas);

module.exports = router;
