require("dotenv").config();

const express = require("express");
const sequelize = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send(
    `API Rodando! Olá, mundo! Ambiente: ${
      process.env.NODE_ENV || "desenvolvimento"
    }`
  );
});

async function LigarServidor() {
  try {
    await sequelize.authenticate();
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
