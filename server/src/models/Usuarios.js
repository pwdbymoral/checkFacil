const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const TiposUsuario = {
  ADM_ESPACO: "Adm_espaco",
  ADM_FESTA: "Adm_festa",
  CONVIDADO: "Convidado",
};

class Usuario extends Model {
  async compararSenha(senha) {
    return bcrypt.compare(senha, this.senha);
  }
}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  tipo: {
    type: DataTypes.ENUM(
      TiposUsuario.ADM_ESPACO,
      TiposUsuario.ADM_FESTA,
      TiposUsuario.CONVIDADO
    ),
    allowNull: false,
    defaultValue: TiposUsuario.CONVIDADO,
  },

  sequelize,
  modelName: "Usuario",
  tableName: "usuarios",
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.changed("senha")) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed("senha")) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
      }
    },
  },
});

Usuario.TIPOS_USUARIO = TIPOS_USUARIO; // Exportando os tipos de usuário

module.exports = Usuario;
