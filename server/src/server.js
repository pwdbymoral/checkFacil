import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import _models, { sequelize } from './models/index.js';

import authRoutes from './routes/authRoutes.js';
import festaRoutes from './routes/festaRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/festa', festaRoutes);

// Rota de teste
app.get('/', (_req, res) => {
  res.send(`API Rodando! Olá, mundo! Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
});

async function LigarServidor() {
  try {
    await sequelize.authenticate();

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
