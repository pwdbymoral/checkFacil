# Documentação da API

## Informações Gerais

- **URL Base (Exemplo):** `http://localhost:3001` (substitua `3001` pela porta que seu servidor está usando)
- **Formato do Corpo da Requisição/Resposta:** `JSON`
- **Headers Comuns para Requisições POST/PUT:**
  ```
  Content-Type: application/json
  ```
- **Autenticação:** Rotas protegidas requerem um token JWT no cabeçalho `Authorization`.
  ```
  Authorization: Bearer SEU_TOKEN_JWT_AQUI
  ```

---

## Endpoints de Autenticação (`/auth`)

### 1. Registrar Novo Convidado

- **Método:** `POST`
- **Endpoint:** `/auth/register/convidado`
- **Descrição:** Registra um novo usuário comum do tipo "Convidado".
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
        "id": 1,
        "nome": "Nome do Convidado",
        "email": "convidado@exemplo.com",
        "telefone": "79999998888",
        "tipoUsuario": "Convidado",
        "createdAt": "2025-06-01T14:00:00.000Z",
        "updatedAt": "2025-06-01T14:00:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "mensagem": "Convidado registrado com sucesso!"
    }
    ```
- **Respostas de Erro Possíveis:** `400 Bad Request`, `500 Internal Server Error`.

---

### 2. Registrar Administrador de Espaço

- **Método:** `POST`
- **Endpoint:** `/auth/register/admEspaco`
- **Descrição:** Registra um novo usuário do tipo "Administrador de Espaço".
- **⚠️ ATENÇÃO:** Esta rota **DEVE SER PROTEGIDA** em produção.
- **Corpo da Requisição (Request Body):** (Igual ao de Convidado)
- **Resposta de Sucesso (Success Response):** (Similar ao de Convidado, mas com `tipoUsuario: "Adm_espaco"` e mensagem apropriada)
- **Respostas de Erro Possíveis:** `400 Bad Request`, `500 Internal Server Error`.

---

### 3. Registrar Administrador de Festa

- **Método:** `POST`
- **Endpoint:** `/auth/register/admFesta`
- **Descrição:** Registra um novo usuário do tipo "Administrador de Festa".
- **⚠️ ATENÇÃO:** Esta rota **DEVE SER PROTEGIDA** em produção.
- **Corpo da Requisição (Request Body):** (Igual ao de Convidado)
- **Resposta de Sucesso (Success Response):** (Similar ao de Convidado, mas com `tipoUsuario: "Adm_festa"` e mensagem apropriada)
- **Respostas de Erro Possíveis:** `400 Bad Request`, `500 Internal Server Error`.

---

### 4. Login de Usuário

- **Método:** `POST`
- **Endpoint:** `/auth/login`
- **Descrição:** Autentica um usuário existente e retorna seus dados e um token JWT.
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
        "telefone": "79999998888",
        "tipoUsuario": "Convidado", // ou Adm_espaco, ou Adm_festa
        "createdAt": "2025-06-01T14:00:00.000Z",
        "updatedAt": "2025-06-01T14:05:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "mensagem": "Login realizado com sucesso!"
    }
    ```
- **Respostas de Erro Possíveis:** `400 Bad Request`, `500 Internal Server Error`.

---

## Endpoints de Festas (`/festa`)

### 1. Criar Nova Festa

- **Método:** `POST`
- **Endpoint:** `/festa/criar-festa`
- **Autenticação:** **Obrigatória**. Requer Bearer Token no header `Authorization`.
  ```
  Authorization: Bearer SEU_TOKEN_JWT_AQUI
  ```
- **Descrição:** Cria um novo registro de festa. O `id_organizador` deve ser o ID de um usuário existente (geralmente um `AdmFesta` ou o ID do usuário logado se ele mesmo for o organizador).
- **Corpo da Requisição (Request Body):**
  ```json
  {
    "nome_festa": "string (obrigatório)",
    "data_festa": "string (obrigatório, formato YYYY-MM-DD)",
    "horario_inicio": "string (opcional, formato HH:MM:SS)",
    "horario_fim": "string (opcional, formato HH:MM:SS)",
    "local_festa": "string (opcional)",
    "descricao": "string (opcional, texto longo)",
    "pacote_escolhido": "string (opcional, um dos valores: 'KIDS', 'KIDS_MAIS_PARK', 'PLAY', 'PLAY_MAIS_PARK', 'SUPER_FESTA_COMPLETA')",
    "numero_adultos_contratado": "integer (opcional)",
    "numero_criancas_contratado": "integer (opcional)",
    "nome_aniversariante": "string (opcional)",
    "idade_aniversariante": "integer (opcional)",
    "tema_festa": "string (opcional)",
    "festa_deixa_e_pegue": "boolean (opcional)",
    "autoriza_uso_imagem": "boolean (opcional)",
    "instagram_cliente": "string (opcional, max 100 caracteres)",
    "procedimento_convidado_fora_lista": "string (opcional, um dos valores: 'PERMITIR_ANOTAR', 'CHAMAR_ANFITRIAO')",
    "link_playlist_spotify": "string (opcional)",
    "observacoes_festa": "string (opcional, texto longo)",
    "id_organizador": "integer (obrigatório, ID de um usuário existente)"
  }
  ```
- **Resposta de Sucesso (Success Response):**
  - **Código:** `201 Created`
  - **Corpo:** O objeto da festa criada (similar ao exemplo abaixo, mas sem o array `festas` e a `mensagem` da listagem).
    ```json
    {
      "id": 4,
      "nome_festa": "Confraternização da Firma",
      "data_festa": "2025-12-10",
      // ... todos os outros campos da festa ...
      "id_organizador": 1,
      "createdAt": "2025-06-01T15:00:00.000Z",
      "updatedAt": "2025-06-01T15:00:00.000Z"
    }
    ```
- **Respostas de Erro Possíveis:**
  - **Código:** `400 Bad Request` (Dados inválidos, `id_organizador` não existe)
  - **Código:** `401 Unauthorized` (Token não fornecido, inválido ou expirado)
  - **Código:** `500 Internal Server Error`

---

### 2. Listar Festas

- **Método:** `GET`
- **Endpoint:** `/festa/listar-festas`
- **Autenticação:** **Obrigatória**. Requer Bearer Token no header `Authorization`.
  ```
  Authorization: Bearer SEU_TOKEN_JWT_AQUI
  ```
- **Descrição:**
  - Se o usuário logado for um `Adm_espaco`, lista todas as festas cadastradas.
  - Se o usuário logado for de outro tipo (ex: `Adm_festa`), lista apenas as festas que ele organizou.
- **Corpo da Requisição (Request Body):** Nenhum.
- **Resposta de Sucesso (Success Response):**
  - **Código:** `200 OK`
  - **Corpo (se houver festas):** Um array de objetos de festa.
    ```json
    [
      {
        "id": 1,
        "nome_festa": "Aniversário da Sofia",
        "data_festa": "2025-07-15",
        // ... outros campos da festa ...
        "id_organizador": 102,
        "createdAt": "2025-06-01T14:10:00.000Z",
        "updatedAt": "2025-06-01T14:10:00.000Z",
        "organizador": {
          // Informações do organizador incluídas
          "id": 102,
          "nome": "Ana Organizadora",
          "email": "ana.admfesta@exemplo.com"
        }
      }
      // ... mais festas ...
    ]
    ```
  - **Corpo (se não houver festas):**
    ```json
    {
      "mensagem": "Nenhuma festa cadastrada no espaço.", // ou "Você ainda não tem festas cadastradas."
      "festas": []
    }
    ```
- **Respostas de Erro Possíveis:**
  - **Código:** `401 Unauthorized` (Token não fornecido, inválido ou expirado)
  - **Código:** `500 Internal Server Error`

---
