// api/server.js

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do banco PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'loja',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'senha123',
});

// Teste de conexão com o banco
pool.on('connect', () => {
    console.log('✅ Conectado ao PostgreSQL!');
});

pool.on('error', (err) => {
    console.error('❌ Erro na conexão com PostgreSQL:', err);
});

// **ROTAS DA API**

// 1. Rota de teste
app.get('/', (req, res) => {
    res.json({
        message: '🚀 API Node.js funcionando!',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// 2. Health check - verifica se API e banco estão funcionando
app.get('/health', async (req, res) => {
    try {
        // Testa a conexão com o banco
        const result = await pool.query('SELECT NOW()');

        res.json({
            status: 'healthy',
            api: '✅ Online',
            database: '✅ Conectado',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        console.error('Erro no health check:', error);
        res.status(500).json({
            status: 'unhealthy',
            api: '⚠️  Online',
            database: '❌ Desconectado',
            error: error.message
        });
    }
});

// 3. Listar todos os produtos
app.get('/produtos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos ORDER BY id');

        res.json({
            success: true,
            count: result.rows.length,
            produtos: result.rows
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// 4. Buscar produto por ID
app.get('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        res.json({
            success: true,
            produto: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// 5. Criar novo produto
app.post('/produtos', async (req, res) => {
    try {
        const { nome, preco, categoria } = req.body;

        // Validação básica
        if (!nome || !preco) {
            return res.status(400).json({
                success: false,
                message: 'Nome e preço são obrigatórios'
            });
        }

        const result = await pool.query(
            'INSERT INTO produtos (nome, preco, categoria) VALUES ($1, $2, $3) RETURNING *',
            [nome, preco, categoria || 'Geral']
        );

        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso',
            produto: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// 6. Atualizar produto
app.put('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, preco, categoria } = req.body;

        const result = await pool.query(
            'UPDATE produtos SET nome = $1, preco = $2, categoria = $3 WHERE id = $4 RETURNING *',
            [nome, preco, categoria, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Produto atualizado com sucesso',
            produto: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// 7. Deletar produto
app.delete('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Produto deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`📦 Produtos: http://localhost:${PORT}/produtos`);
});