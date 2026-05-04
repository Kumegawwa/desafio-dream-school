# 🚀 Scholar CRM - Desafio Técnico The Dream School

Este projeto é uma solução Full-Stack desenvolvida para o desafio técnico da The Dream School. Ele consiste em uma Landing Page de captação de leads, uma API robusta e uma automação de notificações via webhook.

## 🛠️ Tecnologias Utilizadas
*   **Frontend:** Next.js, React, Tailwind CSS (Em construção)
*   **Backend:** Node.js, Express, TypeScript
*   **Banco de Dados:** PostgreSQL
*   **Automação:** n8n
*   **Infraestrutura:** Docker & Docker Compose

## ⚙️ Arquitetura do Projeto
1. O usuário preenche o formulário no Frontend.
2. O Backend (API) recebe os dados, valida e salva no PostgreSQL.
3. O Backend dispara um Webhook para o n8n.
4. O n8n processa a informação e simula o envio de um e-mail para a equipe comercial.

## 🚀 Como rodar o projeto localmente

### 1. Subir a Infraestrutura (Banco e Automação)
Na raiz do projeto, execute:
\`\`\`bash
docker compose up -d
\`\`\`
*O n8n estará disponível em `http://localhost:5678`*

### 2. Iniciar a API (Backend)
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
*A API estará rodando na porta 3001.*

## 📸 Screenshots
[Docker](./docs/docker.png)
[Terminal](./docs/terminal.png.png)
[PowerShell](./docs/powershell.png)