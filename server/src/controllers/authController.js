import models from '../models/index.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function gerarToken(params = {}) {
  if (!JWT_SECRET) {
    console.error('ERRO CRÍTICO: JWT_SECRET Não foi definido no ambiente!');
    throw new Error('JWT_SECRET Não foi definido no ambiente.');
  }

  return jwt.sign(params, JWT_SECRET, {
    expiresIn: 86400 // 24 horas
  });
}

export async function registrarConvidado(req, res) {
  const { nome, email, senha, telefone } = req.body;

  try {
    const usuarioExistente = await models.Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este email já está cadastrado.' });
    }

    const usuario = await models.Usuario.create({
      nome,
      email,
      senha,
      telefone: telefone || null,
      tipoUsuario: models.Usuario.TIPOS_USUARIO.CONVIDADO
    });

    const { senha: _, ...usuarioSemSenha } = usuario.toJSON();

    return res.status(201).json({
      usuario: usuarioSemSenha,
      token: gerarToken({ id: usuario.id, tipo: usuario.tipoUsuario }),
      mensagem: 'Convidado registrado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao registrar Convidado:', error);
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map((e) => e.message);
      return res.status(400).json({ error: 'Dados inválidos.', detalhes: erros });
    }
    return res.status(500).json({ error: 'Erro ao registrar convidado.' });
  }
}

export async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const usuario = await models.Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    if (!(await usuario.compararSenha(senha))) {
      return res.status(400).json({ error: 'Senha inválida.' });
    }

    const { senha: _, ...usuarioSemSenha } = usuario.toJSON();

    return res.status(200).json({
      usuario: usuarioSemSenha,
      token: gerarToken({ id: usuario.id, tipo: usuario.tipoUsuario }),
      mensagem: 'Login realizado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ error: 'Erro ao fazer login.' });
  }
}

export async function registrarAdmEspaco(req, res) {
  const { nome, email, senha, telefone } = req.body;

  try {
    const usuarioExistente = await models.Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este email já está cadastrado.' });
    }

    const usuario = await models.Usuario.create({
      nome,
      email,
      senha,
      telefone: telefone || null,
      tipoUsuario: models.Usuario.TIPOS_USUARIO.ADM_ESPACO
    });

    const { senha: _, ...usuarioSemSenha } = usuario.toJSON();

    return res.status(201).json({
      usuario: usuarioSemSenha,
      token: gerarToken({ id: usuario.id, tipo: usuario.tipoUsuario }),
      mensagem: 'Administrador de Espaço registrado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao registrar Administrador de Espaço:', error);
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map((e) => e.message);
      return res.status(400).json({ error: 'Dados inválidos.', detalhes: erros });
    }
    return res.status(500).json({ error: 'Erro ao registrar administrador do espaço.' });
  }
}

export async function registrarAdmFesta(req, res) {
  const { nome, email, senha, telefone } = req.body;

  try {
    const usuarioExistente = await models.Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este email já está cadastrado.' });
    }

    const usuario = await models.Usuario.create({
      nome,
      email,
      senha,
      telefone: telefone || null,
      tipoUsuario: models.Usuario.TIPOS_USUARIO.ADM_FESTA
    });

    const { senha: _, ...usuarioSemSenha } = usuario.toJSON();

    return res.status(201).json({
      usuario: usuarioSemSenha,
      token: gerarToken({ id: usuario.id, tipo: usuario.tipoUsuario }),
      mensagem: 'Administrador de Festa registrado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao registrar Administrador de Festa:', error);
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map((e) => e.message);
      return res.status(400).json({ error: 'Dados inválidos.', detalhes: erros });
    }
    return res.status(500).json({ error: 'Erro ao registrar administrador da festa.' });
  }
}
