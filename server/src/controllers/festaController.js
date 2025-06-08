import models from '../models/index.js';
import { Op } from 'sequelize';


export async function criarFesta(req, res) {
  const {
    nome_festa,
    data_festa,
    horario_inicio,
    horario_fim,
    local_festa,
    descricao,
    pacote_escolhido,
    numero_adultos_contratado,
    numero_criancas_contratado,
    nome_aniversariante,
    idade_aniversariante,
    tema_festa,
    festa_deixa_e_pegue,
    autoriza_uso_imagem,
    instagram_cliente,
    procedimento_convidado_fora_lista,
    link_playlist_spotify,
    observacoes_festa,
    id_organizador
  } = req.body;

  try {
    const festa = await models.Festa.create({
      nome_festa,
      data_festa,
      horario_inicio: horario_inicio || null,
      horario_fim: horario_fim || null,
      local_festa: local_festa || null,
      descricao: descricao || null,
      pacote_escolhido: pacote_escolhido || null,
      numero_adultos_contratado: numero_adultos_contratado || null,
      numero_criancas_contratado: numero_criancas_contratado || null,
      nome_aniversariante: nome_aniversariante || null,
      idade_aniversariante: idade_aniversariante || null,
      tema_festa: tema_festa || null,
      festa_deixa_e_pegue: festa_deixa_e_pegue === undefined ? null : Boolean(festa_deixa_e_pegue),
      autoriza_uso_imagem: autoriza_uso_imagem === undefined ? null : Boolean(autoriza_uso_imagem),
      instagram_cliente: instagram_cliente || null,
      procedimento_convidado_fora_lista: procedimento_convidado_fora_lista || null,
      link_playlist_spotify: link_playlist_spotify || null,
      observacoes_festa: observacoes_festa || null,
      id_organizador
    });

    return res.status(201).json(festa);
  } catch (error) {
    console.error('Erro ao criar festa:', error);
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map((e) => e.message);
      return res.status(400).json({ error: 'Dados inválidos para criar festa.', detalhes: erros });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: 'Erro de chave estrangeira: Verifique se o id_organizador é válido.'
      });
    }
    return res.status(500).json({ error: 'Falha ao criar festa.' });
  }
}

export async function buscarFestas(req, res) {
  try {
    const idUsuarioLogado = req.usuarioId;
    const tipoUsuarioLogado = req.usuarioTipo;
    const { data, data_inicio, data_fim } = req.query; 

    let whereClause = {}; 

    // Adiciona o filtro de organizador para usuários que não são AdmEspaco
    if (tipoUsuarioLogado !== models.Usuario.TIPOS_USUARIO.ADM_ESPACO) {
      whereClause.id_organizador = idUsuarioLogado;
    }

    
    if (data) {
      // Se uma data específica for fornecida
      whereClause.data_festa = data;
    } else if (data_inicio && data_fim) {
      // Se um intervalo de datas for fornecido
      whereClause.data_festa = {
        [Op.between]: [data_inicio, data_fim],
      };
    } else if (data_inicio) {
      // Se apenas a data de início for fornecida
      whereClause.data_festa = {
        [Op.gte]: data_inicio, //Maior ou igual a
      };
    } else if (data_fim) {
      // Se apenas a data de fim for fornecida
      whereClause.data_festa = {
        [Op.lte]: data_fim, //Menor ou igual a
      };
    }
    

    const festas = await models.Festa.findAll({
      where: whereClause, 
      include: [
        {
          model: models.Usuario,
          as: 'organizador',
          attributes: ['id', 'nome', 'email']
        }
      ],
      order: [['data_festa', 'ASC']] 
    });

    if (festas.length === 0) {
      return res.status(200).json({ mensagem: "Nenhuma festa encontrada com os filtros aplicados.", festas: [] });
    }

    return res.status(200).json(festas);
  } catch (error) {
    console.error('Erro ao listar festas:', error);
    return res.status(500).json({ error: 'Falha ao listar festas.' });
  }
}

export async function atualizarFesta(req, res) {
  try {
    const { idFesta } = req.params;
    const dadosAtualizados = req.body;
    const { usuarioId, usuarioTipo } = req;

    
    const festa = await models.Festa.findByPk(idFesta);
    if (!festa) {
      return res.status(404).json({ error: 'Festa não encontrada com o ID fornecido.' });
    }

    
    if (usuarioTipo !== models.Usuario.TIPOS_USUARIO.ADM_ESPACO && festa.id_organizador !== usuarioId) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para atualizar esta festa.' });
    }

    await festa.update(dadosAtualizados);

    return res.status(200).json(festa);

  } catch (error) {
    console.error('Erro ao atualizar festa:', error);
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map((e) => e.message);
      return res.status(400).json({ error: 'Dados inválidos para atualizar festa.', detalhes: erros });
    }
    return res.status(500).json({ error: 'Falha ao atualizar a festa.' });
  }
}

export async function deletarFesta(req, res) {
  try {
    const { idFesta } = req.params;
    const { usuarioId, usuarioTipo } = req;

    const festa = await models.Festa.findByPk(idFesta);
    if (!festa) {
      return res.status(404).json({ error: 'Festa não encontrada com o ID fornecido.' });
    }

    if (usuarioTipo !== models.Usuario.TIPOS_USUARIO.ADM_ESPACO && festa.id_organizador !== usuarioId) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para deletar esta festa.' });
    }

    await festa.destroy();

    return res.status(200).json({ mensagem: 'Festa deletada com sucesso.' });

  } catch (error) {
    console.error('Erro ao deletar festa:', error);
    return res.status(500).json({ error: 'Falha ao deletar a festa.' });
  }
}

export async function adicionarConvidado(req, res) {
  try {
    const { idFesta } = req.params; //  ID da festa da URL
    const dadosConvidado = req.body; // dados do novo convidado 
    const { usuarioId, usuarioTipo } = req; // Pega dados do utilizador logado

    const festa = await models.Festa.findByPk(idFesta);
    if (!festa) {
      return res.status(404).json({ error: 'Festa não encontrada com o ID fornecido.' });
    }

    // Verifica a permissão para adicionar o convidado
    if (usuarioTipo !== models.Usuario.TIPOS_USUARIO.ADM_ESPACO && festa.id_organizador !== usuarioId) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para adicionar convidados a esta festa.' });
    }

    // Validação básica dos dados do convidado
    if (!dadosConvidado.nome_convidado || !dadosConvidado.tipo_convidado) {
        return res.status(400).json({ error: "Nome e tipo do convidado são obrigatórios." });
    }

    // Cria o novo convidado, associando-o à festa
    const novoConvidado = await models.ConvidadoFesta.create({
      ...dadosConvidado, 
      id_festa: idFesta,  
    });

    return res.status(201).json(novoConvidado);

  } catch (error) {
    console.error('Erro ao adicionar convidado:', error);
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map((e) => e.message);
      return res.status(400).json({ error: 'Dados inválidos para o convidado.', detalhes: erros });
    }
    return res.status(500).json({ error: 'Falha ao adicionar convidado.' });
  }
}

export async function listarConvidadosDaFesta(req, res) {
  try {
    const { idFesta } = req.params; // ID da festa da URL
    const { usuarioId, usuarioTipo } = req; // Pega dados do utilizador logado

    const festa = await models.Festa.findByPk(idFesta);
    if (!festa) {
      return res.status(404).json({ error: 'Festa não encontrada com o ID fornecido.' });
    }

    
    if (usuarioTipo !== models.Usuario.TIPOS_USUARIO.ADM_ESPACO && festa.id_organizador !== usuarioId) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para ver os convidados desta festa.' });
    }

    const convidados = await models.ConvidadoFesta.findAll({
      where: { id_festa: idFesta },
      order: [['nome_convidado', 'ASC']] 
    });

    return res.status(200).json(convidados);

  } catch (error) {
    console.error('Erro ao listar convidados:', error);
    return res.status(500).json({ error: 'Falha ao listar convidados.' });
  }
}

export async function buscarConvidadosPorNome(req, res) {
  try {
    const { idFesta } = req.params;
    const { nome } = req.query;
    const { usuarioId, usuarioTipo } = req; // Pega dados do utilizador logado

    if (!nome) {
      return res.status(400).json({ error: 'O parâmetro de busca "nome" é obrigatório.' });
    }

    const festa = await models.Festa.findByPk(idFesta);
    if (!festa) {
      return res.status(404).json({ error: 'Festa não encontrada.' });
    }

    // permissão
    if (usuarioTipo !== models.Usuario.TIPOS_USUARIO.ADM_ESPACO && festa.id_organizador !== usuarioId) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para buscar convidados nesta festa.' });
    }

    const convidados = await models.ConvidadoFesta.findAll({
      where: {
        id_festa: idFesta,
        nome_convidado: {
          
          [Op.like]: `%${nome}%`
        }
      },
      order: [['nome_convidado', 'ASC']]
    });

    if (convidados.length === 0) {
      return res.status(200).json({ mensagem: "Nenhum convidado encontrado com o nome fornecido.", convidados: [] });
    }

    return res.status(200).json(convidados);

  } catch (error) {
    console.error('Erro ao buscar convidados por nome:', error);
    return res.status(500).json({ error: 'Falha ao buscar convidados.' });
  }
}

export async function atualizarConvidado(req, res) {
  try {
    const { idFesta, idConvidado } = req.params;
    const dadosAtualizados = req.body;
    const { usuarioId, usuarioTipo } = req;

    const festa = await models.Festa.findByPk(idFesta);
    if (!festa) {
      return res.status(404).json({ error: 'Festa não encontrada com o ID fornecido.' });
    }

    
    if (usuarioTipo !== models.Usuario.TIPOS_USUARIO.ADM_ESPACO && festa.id_organizador !== usuarioId) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para atualizar convidados nesta festa.' });
    }

    const convidado = await models.ConvidadoFesta.findOne({ where: { id: idConvidado, id_festa: idFesta }});
    if (!convidado) {
      return res.status(404).json({ error: 'Convidado não encontrado nesta festa com o ID fornecido.' });
    }

    await convidado.update(dadosAtualizados);

    return res.status(200).json(convidado);

  } catch (error) {
    console.error('Erro ao atualizar convidado:', error);
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map((e) => e.message);
      return res.status(400).json({ error: 'Dados inválidos para atualizar o convidado.', detalhes: erros });
    }
    return res.status(500).json({ error: 'Falha ao atualizar o convidado.' });
  }
}

export async function deletarConvidado(req, res) {
  try {
    const { idFesta, idConvidado } = req.params;
    const { usuarioId, usuarioTipo } = req;

    const festa = await models.Festa.findByPk(idFesta);
    if (!festa) {
      return res.status(404).json({ error: 'Festa não encontrada com o ID fornecido.' });
    }

   
    if (usuarioTipo !== models.Usuario.TIPOS_USUARIO.ADM_ESPACO && festa.id_organizador !== usuarioId) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para deletar convidados desta festa.' });
    }

    const convidado = await models.ConvidadoFesta.findOne({ where: { id: idConvidado, id_festa: idFesta }});
    if (!convidado) {
      return res.status(404).json({ error: 'Convidado não encontrado nesta festa com o ID fornecido.' });
    }

    await convidado.destroy();

    return res.status(200).json({ mensagem: 'Convidado deletado com sucesso.' });

  } catch (error) {
    console.error('Erro ao deletar convidado:', error);
    return res.status(500).json({ error: 'Falha ao deletar o convidado.' });
  }
}