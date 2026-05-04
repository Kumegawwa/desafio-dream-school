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
pool.query(`
  CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    curso_desejado VARCHAR(50),
    nivel_ingles VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Novo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log('✅ Tabela "leads" pronta no banco de dados!'))
  .catch(err => console.error('❌ Erro ao criar tabela:', err));

// 3. ROTA POST: Recebe os dados do Frontend (Landing Page)
app.post('/leads', async (req, res) => {
  const { nome, email, curso_desejado, nivel_ingles } = req.body;

  try {
    // Salva no Banco de Dados
    const result = await pool.query(
      'INSERT INTO leads (nome, email, curso_desejado, nivel_ingles) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, curso_desejado, nivel_ingles]
    );
    const novoLead = result.rows[0];

    res.status(201).json({ message: 'Lead criado com sucesso!', lead: novoLead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar lead. Talvez o email já exista.' });
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