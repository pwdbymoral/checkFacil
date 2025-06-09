import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'nome_do_banco',
  process.env.DB_USER || 'usuario_do_banco',
  process.env.DB_PASSWORD || 'senha_do_banco',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: '-03:00'
  }
);

export default sequelize;
