import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexão com o PostgreSQL
const pool = new Pool({
  user: 'admin',
  host: '127.0.0.1',
  database: 'scholar_db',
  password: 'senha_super_segura',
  port: 5432,
});

// 2. Cria a tabela automaticamente quando a API ligar
// Empacotado em uma função async para resolver o erro do TypeScript
async function iniciarBanco() {
  try {
    await pool.query('DROP TABLE IF EXISTS leads;');

    // Adicionado o created_at para a rota GET funcionar corretamente
    await pool.query(`
      CREATE TABLE leads (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabela "leads" recriada com sucesso no banco de dados!');
  } catch (error) {
    console.error('⚠️ Erro ao recriar a tabela:', error);
  }
}

// Executa a função na inicialização
iniciarBanco();

// 3. ROTA POST: Recebe os dados do Frontend (Landing Page)
app.post('/leads', async (req, res) => {
  const { nome, email, telefone } = req.body;

  try {
    // 1. Salva no Banco de Dados
    const result = await pool.query(
      'INSERT INTO leads (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, telefone]
    );

    const novoLead = result.rows[0];

    // 2. Dispara o alerta para o n8n (Webhook)
    try {
      await fetch('http://localhost:5678/webhook-test/novo-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoLead), 
      });
      console.log('✅ Webhook disparado com sucesso para o n8n!');
    } catch (webhookError) {
      console.error('⚠️ Erro ao avisar o n8n:', webhookError);
    }

    // 3. Responde para o Frontend que deu tudo certo
    res.status(201).json({ message: 'Lead criado com sucesso!', lead: novoLead });

  } catch (error) {
    console.error('Erro ao criar lead:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 4. ROTA GET: Envia os leads cadastrados para o Dashboard (CRM)
app.get('/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

// 5. Inicia o servidor na porta 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend rodando na porta ${PORT}`);
});