import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';

import Usuario from './models/Usuarios.js';
import Festa from './models/Festa.js';

// ROTAS
import authRoutes from './routes/authRoutes.js';
import festaRoutes from './routes/festaRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

const dbModels = {
  Usuario,
  Festa
};

Object.values(dbModels).forEach((model) => {
  if (model && typeof model.associate === 'function') {
    model.associate(dbModels);
  }
});

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/festa', festaRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send(`API Rodando! Olá, mundo! Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
});

async function LigarServidor() {
  try {
    await sequelize.authenticate(); // Testa a conexão com o banco
    // eslint-disable-next-line no-console
    console.log('Conexão com o MySQL estabelecida com sucesso.');

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Servidor rodando na porta ${port} em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados ou iniciar o servidor:', error);
    process.exit(1);
  }
}

LigarServidor();
