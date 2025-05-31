const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const TIPOS_USUARIO = {
  ADM_ESPACO: "Adm_espaco",
  ADM_FESTA: "Adm_festa",
  CONVIDADO: "Convidado",
};

class Usuario extends Model {
  async compararSenha(senha) {
    return bcrypt.compare(senha, this.senha);
  }
}

Usuario.init(
  {
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
      validate: {
        isEmail: {
          msg: "O email deve ser um endereço de email válido.",
        },
      },
    },

    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    tipoUsuario: {
      type: DataTypes.ENUM(
        TIPOS_USUARIO.ADM_ESPACO,
        TIPOS_USUARIO.ADM_FESTA,
        TIPOS_USUARIO.CONVIDADO
      ),
      allowNull: false,
      defaultValue: TiposUsuario.CONVIDADO,
    },
  },
  {
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
  }
);

Usuario.TIPOS_USUARIO = TIPOS_USUARIO; // Exportando os tipos de usuário

module.exports = Usuario;
