# Documentação da API de Autenticação

## Informações Gerais

- **URL Base (Exemplo):** `http://localhost:3001` (substitua `3001` pela porta que seu servidor está usando)
- **Formato do Corpo da Requisição/Resposta:** `JSON`
- **Headers Comuns para Requisições POST:**
  ```
  Content-Type: application/json
  ```

---

## Endpoints de Autenticação

Todos os endpoints de autenticação estão sob o prefixo `/auth`.

### 1. Registrar Novo Convidado

- **Método:** `POST`
- **Endpoint:** `/auth/register/convidado`
- **Descrição:** Registra um novo usuário comum do tipo "Convidado". Esta é geralmente a rota pública de cadastro.
- **Corpo da Requisição (Request Body):**
  ```json
  {
    "nome": "string (obrigatório)",
    "email": "string (obrigatório, formato de email válido, deve ser único)",
    "senha": "string (obrigatório, mínimo 6 caracteres)",
    "telefone": "string (opcional)"
  }
  ```
- **Resposta de Sucesso (Success Response):**
  - **Código:** `201 Created`
  - **Corpo:**
    ```json
    {
      "usuario": {
        "id": 1,
        "nome": "Nome do Convidado",
        "email": "convidado@exemplo.com",
        "telefone": "79999998888", // ou null se não fornecido
        "tipoUsuario": "Convidado",
        "createdAt": "2025-05-31T20:00:00.000Z", // Exemplo de formato de data
        "updatedAt": "2025-05-31T20:00:00.000Z" // Exemplo de formato de data
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Token JWT
      "mensagem": "Convidado registrado com sucesso!"
    }
    ```
- **Respostas de Erro Possíveis (Error Responses):**
  - **Código:** `400 Bad Request`
    - Motivo: Dados faltando ou inválidos (ex: email em formato incorreto, senha curta).
    - Corpo Exemplo:
      ```json
      {
        "error": "Dados inválidos.",
        "detalhes": ["O email deve ser um endereço de email válido."]
      }
      ```
    - Motivo: Email já cadastrado.
    - Corpo Exemplo:
      ```json
      {
        "error": "Este email já está cadastrado."
      }
      ```
  - **Código:** `500 Internal Server Error`
    - Motivo: Falha interna no servidor ao tentar registrar o usuário.
    - Corpo Exemplo:
      ```json
      {
        "error": "Erro ao registrar convidado."
      }
      ```

---

### 2. Registrar Administrador de Espaço

- **Método:** `POST`
- **Endpoint:** `/auth/register/admEspaco`
- **Descrição:** Registra um novo usuário do tipo "Administrador de Espaço".
- **⚠️ ATENÇÃO:** Esta rota é para criação de um usuário com privilégios administrativos. Ela **DEVE SER PROTEGIDA** em um ambiente de produção para garantir que apenas usuários autorizados (ex: outros administradores) possam acessá-la.
- **Corpo da Requisição (Request Body):**
  ```json
  {
    "nome": "string (obrigatório)",
    "email": "string (obrigatório, formato de email válido, único)",
    "senha": "string (obrigatório, mínimo 6 caracteres)",
    "telefone": "string (opcional)"
  }
  ```
- **Resposta de Sucesso (Success Response):**
  - **Código:** `201 Created`
  - **Corpo:**
    ```json
    {
      "usuario": {
        "id": 2,
        "nome": "Nome do Adm Espaço",
        "email": "admespaco@exemplo.com",
        "telefone": null, // ou o telefone se fornecido
        "tipoUsuario": "Adm_espaco",
        "createdAt": "2025-05-31T20:05:00.000Z",
        "updatedAt": "2025-05-31T20:05:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Token JWT
      "mensagem": "Administrador de Espaço registrado com sucesso!"
    }
    ```
- **Respostas de Erro Possíveis (Error Responses):**
  - Similares à rota de "Registrar Convidado", com mensagens de erro que podem especificar "Administrador de Espaço".

---

### 3. Registrar Administrador de Festa

- **Método:** `POST`
- **Endpoint:** `/auth/register/admFesta`
- **Descrição:** Registra um novo usuário do tipo "Administrador de Festa".
- **⚠️ ATENÇÃO:** Esta rota é para criação de um usuário com privilégios administrativos. Ela **DEVE SER PROTEGIDA** em um ambiente de produção.
- **Corpo da Requisição (Request Body):**
  ```json
  {
    "nome": "string (obrigatório)",
    "email": "string (obrigatório, formato de email válido, único)",
    "senha": "string (obrigatório, mínimo 6 caracteres)",
    "telefone": "string (opcional)"
  }
  ```
- **Resposta de Sucesso (Success Response):**
  - **Código:** `201 Created`
  - **Corpo:**
    ```json
    {
      "usuario": {
        "id": 3,
        "nome": "Nome do Adm Festa",
        "email": "admfesta@exemplo.com",
        "telefone": "79111112222",
        "tipoUsuario": "Adm_festa",
        "createdAt": "2025-05-31T20:10:00.000Z",
        "updatedAt": "2025-05-31T20:10:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Token JWT
      "mensagem": "Administrador de Festa registrado com sucesso!"
    }
    ```
- **Respostas de Erro Possíveis (Error Responses):**
  - Similares à rota de "Registrar Convidado", com mensagens de erro que podem especificar "Administrador de Festa".

---

### 4. Login de Usuário

- **Método:** `POST`
- **Endpoint:** `/auth/login`
- **Descrição:** Autentica um usuário existente (qualquer tipo) e retorna seus dados e um token JWT.
- **Corpo da Requisição (Request Body):**
  ```json
  {
    "email": "string (obrigatório, email cadastrado)",
    "senha": "string (obrigatório, senha correta)"
  }
  ```
- **Resposta de Sucesso (Success Response):**
  - **Código:** `200 OK`
  - **Corpo:**
    ```json
    {
      "usuario": {
        "id": 1,
        "nome": "Nome do Usuario Logado",
        "email": "usuario@exemplo.com",
        "telefone": "79999998888", // ou null
        "tipoUsuario": "Convidado", // ou Adm_espaco, ou Adm_festa
        "createdAt": "2025-05-31T20:00:00.000Z",
        "updatedAt": "2025-05-31T20:15:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Token JWT
      "mensagem": "Login realizado com sucesso!"
    }
    ```
- **Respostas de Erro Possíveis (Error Responses):**
  - **Código:** `400 Bad Request`
    - Motivo: Campos `email` ou `senha` faltando na requisição.
    - Corpo Exemplo:
      ```json
      {
        "error": "Campos obrigatórios: email e senha."
      }
      ```
    - Motivo: Usuário não encontrado com o email fornecido.
    - Corpo Exemplo:
      ```json
      {
        "error": "Usuário não encontrado."
      }
      ```
    - Motivo: Senha inválida para o email fornecido.
    - Corpo Exemplo:
      ```json
      {
        "error": "Senha inválida."
      }
      ```
  - **Código:** `500 Internal Server Error`
    - Motivo: Falha interna no servidor ao tentar realizar o login.
    - Corpo Exemplo:
      ```json
      {
        "error": "Erro ao fazer login."
      }
      ```

---
