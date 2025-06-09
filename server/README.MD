# 🎉 CheckFacil - Backend API

Sistema de gestão de festas infantis do **Espaço Criar**, responsável por:
- Lógica de negócios
- Autenticação via JWT
- Gestão de festas, clientes e convidados
- Integrações com webhooks (n8n)

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript
- **Express.js** – Framework para criação de APIs
- **Sequelize** – ORM para MySQL
- **MySQL** – Banco de dados relacional
- **JWT** – Autenticação de rotas
- **Axios** – Requisições HTTP (ex: integração com n8n)
- **CORS** – Liberação de origens para o frontend
- **dotenv** – Variáveis de ambiente
- **bcryptjs** – Hash seguro de senhas
- **Yarn Workspaces** – Monorepo

---

## ⚙️ Configuração do Ambiente

### ✔️ Pré-requisitos

- Node.js `v22.x` ou superior  
- Yarn `v4.x` ou superior  
- Banco de dados MySQL ativo  

### 📦 Instalação

```bash
yarn install
```

### 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `/server` com:

```env
# Banco de Dados
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=checkfacil_db
DB_PORT=3306

# JWT
JWT_SECRET=gere_um_segredo_forte_e_aleatorio_aqui

# Porta do Servidor
PORT=3001
```

---

## 🚀 Execução do Projeto

Modo desenvolvimento (somente o backend):

```bash
yarn dev:server
```

Frontend + Backend juntos:

```bash
yarn dev
```

A API estará disponível em: [http://localhost:3001](http://localhost:3001)

---

## 🔐 Endpoints de Autenticação (`/auth`)

> Todas as rotas relacionadas ao login e cadastro de usuários (admin e convidados).

| Método | Rota                          | Descrição                                                |
|--------|-------------------------------|----------------------------------------------------------|
| POST   | `/auth/register/convidado`    | Registra um novo convidado no sistema                    |
| POST   | `/auth/register/admEspaco`    | Registra um novo administrador do espaço                 |
| POST   | `/auth/register/admFesta`     | Registra um novo administrador de festa                  |
| POST   | `/auth/login`                 | Realiza login e retorna token JWT                        |
| POST   | `/auth/definir-senha`         | Permite definição de senha via token de primeiro acesso  |

#### 🔸 Exemplo: Login

```json
{
  "email": "admin@exemplo.com",
  "senha": "senha_forte_aqui"
}
```

#### 🔸 Exemplo: Definir Senha

```json
{
  "token": "token_de_uso_unico_enviado_no_link",
  "novaSenha": "nova_senha_forte"
}
```

---

## 🎉 Endpoints de Festas (`/festa`)

🔐 Requer autenticação via token JWT.

| Método | Rota               | Descrição                                      |
|--------|--------------------|-----------------------------------------------|
| POST   | `/festa/criar`     | Cria uma nova festa e associa um cliente      |
| GET    | `/festa/listar`    | Lista festas com filtros e permissões         |
| PATCH  | `/festa/:idFesta`  | Atualiza uma festa específica                 |
| DELETE | `/festa/:idFesta`  | Remove uma festa do sistema                   |

### 🔍 Filtros disponíveis em `/festa/listar`

- `?data=2025-12-25` → por data exata  
- `?data_inicio=2025-12-01&data_fim=2025-12-31` → por intervalo de datas  

---

## 🧑‍🤝‍🧑 Endpoints de Convidados (`/festa/:idFesta/convidados`)

> Gerenciamento de convidados vinculados a uma festa. Requer autenticação JWT.

| Método | Rota                                                                 | Descrição                            |
|--------|----------------------------------------------------------------------|--------------------------------------|
| POST   | `/festa/:idFesta/convidados`                                         | Adiciona um novo convidado à festa   |
| GET    | `/festa/:idFesta/convidados`                                         | Lista todos os convidados da festa   |
| GET    | `/festa/:idFesta/convidados/buscar?nome=João`                        | Busca convidados pelo nome           |
| PATCH  | `/festa/:idFesta/convidados/:idConvidado`                            | Atualiza um convidado específico     |
| DELETE | `/festa/:idFesta/convidados/:idConvidado`                            | Remove um convidado específico       |

#### 🔸 Exemplo: Adicionar Convidado

```json
{
  "nome_convidado": "João da Silva",
  "tipo_convidado": "ADULTO_PAGANTE",
  "idade_convidado": 30,
  "nome_responsavel": null,
  "telefone_responsavel": null
}
```

---

## ✅ Observações Técnicas

- **Todas as rotas de `/festa` e `/festa/:idFesta/convidados` são protegidas com JWT**.
- **Middlewares** utilizados:
  - `verificarTokenJWT`: para rotas protegidas
  - `validarRegistro`, `validarLogin`: validação de corpo de requisição em cadastros/login
- Os registros de administrador (`admEspaco`, `admFesta`) devem ser protegidos em produção.
