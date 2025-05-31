function validarRegistro(req, res, next) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ error: "Nome, Email e senha são obrigatórios." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido." });
  }

  if (typeof email !== "string" || typeof senha !== "string") {
    return res.status(400).json({ error: "Email e senha devem ser strings." });
  }

  next();
}

function validarLogin(req, res, next) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido." });
  }

  if (typeof email !== "string" || typeof senha !== "string") {
    return res.status(400).json({ error: "Email e senha devem ser strings." });
  }

  next();
}

module.exports = {
  validarRegistro,
  validarLogin,
};
