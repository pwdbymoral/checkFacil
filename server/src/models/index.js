import sequelize from '../config/database.js';

import Usuario from './Usuarios.js';
import Festa from './Festa.js';

const models = {
  Usuario,
  Festa
};

Object.values(models).forEach((model) => {
  if (model && typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize };
export default models;
