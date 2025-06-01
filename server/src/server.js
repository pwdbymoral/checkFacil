require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const Usuario = require("./models/Usuarios");
const Festa = require("./models/Festa");

//ROTAS
const authRoutes = require("./routes/authRoutes");
const festaRoutes = require("./routes/festaRoutes");

const app = express();
const port = process.env.PORT || 3000;

const dbModels = {
  Usuario,
  Festa,
};

Object.values(dbModels).forEach((model) => {
  if (model && typeof model.associate === "function") {
    model.associate(dbModels);
  }
});

app.use(cors());
app.use(express.json());

// Configuração das Rotas
app.use("/auth", authRoutes);
app.use("/festa", festaRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.send(
    `API Rodando! Olá, mundo! Ambiente: ${
      process.env.NODE_ENV || "desenvolvimento"
    }`
  );
});

async function LigarServidor() {
  try {
    await sequelize.authenticate(); // Testa a conexão com o banco
    console.log("Conexão com o MySQL estabelecida com sucesso.");

    app.listen(port, () => {
      console.log(
        `Servidor rodando na porta ${port} em http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error(
      "Não foi possível conectar ao banco de dados ou iniciar o servidor:",
      error
    );
    process.exit(1);
  }
}

LigarServidor();
