const Usuario = require("../models/Usuarios");
const Festa = require("../models/Festa");

async function criarFesta(req, res) {
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
    id_organizador,
  } = req.body;

  try {
    const festa = await Festa.create({
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
      festa_deixa_e_pegue:
        festa_deixa_e_pegue === undefined ? null : Boolean(festa_deixa_e_pegue),
      autoriza_uso_imagem:
        autoriza_uso_imagem === undefined ? null : Boolean(autoriza_uso_imagem),
      instagram_cliente: instagram_cliente || null,
      procedimento_convidado_fora_lista:
        procedimento_convidado_fora_lista || null,
      link_playlist_spotify: link_playlist_spotify || null,
      observacoes_festa: observacoes_festa || null,
      id_organizador,
    });

    return res.status(201).json(festa);
  } catch (error) {
    console.error("Erro ao criar festa:", error);
    if (error.name === "SequelizeValidationError") {
      const erros = error.errors.map((e) => e.message);
      return res
        .status(400)
        .json({ error: "Dados inválidos para criar festa.", detalhes: erros });
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error:
          "Erro de chave estrangeira: Verifique se o id_organizador é válido.",
      });
    }
    return res.status(500).json({ error: "Falha ao criar festa." });
  }
}

async function buscarFestas(req, res) {
  try {
    //ID e o tipo do usuário logado,

    const idUsuarioLogado = req.usuarioId;
    const tipoUsuarioLogado = req.usuarioTipo;

    let queryOptions = {
      include: [
        {
          model: Usuario,
          as: "organizador", //  associação
          attributes: ["id", "nome", "email"],
        },
      ],
      order: [["data_festa", "DESC"]],
    };

    let festas;
    let mensagemNenhumaFesta = "Nenhuma festa encontrada."; // Mensagem padrão

    if (tipoUsuarioLogado === Usuario.TIPOS_USUARIO.ADM_ESPACO) {
      // AdmEspaco: Busca todas as festas
      festas = await Festa.findAll(queryOptions);
      mensagemNenhumaFesta = "Nenhuma festa cadastrada no espaço.";
    } else {
      queryOptions.where = { id_organizador: idUsuarioLogado };
      festas = await Festa.findAll(queryOptions);
      mensagemNenhumaFesta = "Você ainda não tem festas cadastradas.";
    }

    if (festas.length === 0) {
      return res
        .status(200)
        .json({ mensagem: mensagemNenhumaFesta, festas: [] });
    }

    return res.status(200).json(festas);
  } catch (error) {
    console.error("Erro ao listar festas:", error);
    return res.status(500).json({ error: "Falha ao listar festas." });
  }
}

module.exports = {
  criarFesta,
  buscarFestas,
};
