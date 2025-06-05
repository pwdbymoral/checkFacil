# Projeto Check Fácil

Bem-vindo ao repositório do CheckFacil! Esta é uma Aplicação Web Progressiva (PWA) projetada para otimizar o gerenciamento de eventos, com foco em processos de check-in e check-out de convidados.

## Visão Geral da Estrutura

Este projeto é um monorepo gerenciado com Yarn Workspaces e Plug'n'Play (PnP). Ele é composto pelos seguintes workspaces principais:

* **`/client`**: Contém o frontend da aplicação (PWA).
  * Tecnologias: React, TypeScript, Vite, Shadcn/UI, Tailwind CSS.
  * Responsável pela interface do usuário para Staff e Contratantes da Festa.
* **`/server`**: Contém a API backend.
  * Tecnologias: Node.js, Express.js, MySQL.
  * Responsável pela lógica de negócios, autenticação e persistência de dados.

## Tecnologias Principais do Monorepo

* Yarn 4.x (com Workspaces e Plug'n'Play)
* TypeScript
* ESLint (configuração centralizada na raiz)
* Prettier (configuração centralizada na raiz)

## Pré-requisitos

* Node.js (v20.x ou superior recomendado)
* Yarn (v4.x.x)

## Configuração Inicial do Ambiente

1. Clone este repositório:

    ```bash
    git clone [https://github.com/pwdbymoral/checkFacil.git](https://github.com/pwdbymoral/checkFacil.git)
    cd checkFacil
    ```

2. Instale todas as dependências (da raiz e dos workspaces):

    ```bash
    yarn install
    ```

3. **Variáveis de Ambiente:**
    * Para o funcionamento correto, tanto o `client` quanto o `server` podem necessitar de variáveis de ambiente específicas, geralmente configuradas em arquivos `.env` dentro de cada respectivo workspace.
    * **Client (`client/.env`)**
    * **Server (`server/.env`)**
    * Consulte a documentação específica de cada workspace (ou o código) para as variáveis necessárias conforme o projeto evolui.

## Rodando o Projeto em Desenvolvimento

* **Para rodar cliente e servidor simultaneamente (recomendado):**

    ```bash
    yarn dev
    ```

* **Para rodar apenas o cliente:**

    ```bash
    yarn dev:client
    ```

* **Para rodar apenas o servidor:**

    ```bash
    yarn dev:server
    ```

## Scripts Úteis (Rodar da Raiz)

* **Verificar Linting:**

    ```bash
    yarn lint
    ```

* **Corrigir Linting Automaticamente:**

    ```bash
    yarn lint:fix
    ```

* **Formatar Código com Prettier:**

    ```bash
    yarn format
    ```

* **Verificar Formatação com Prettier:**

    ```bash
    yarn format:check
    ```

## Contribuição

Por favor, siga o padrão de [Conventional Commits](https://www.conventionalcommits.org/) para as mensagens de commit e utilize feature branches para o desenvolvimento de novas funcionalidades ou correções.

---
