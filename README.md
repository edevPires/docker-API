# 🚀 API Node.js + PostgreSQL com Docker Compose

Sistema simples de loja com API RESTful usando Node.js, Express e PostgreSQL, orquestrado com Docker Compose.

## 📁 Estrutura do Projeto

```
projeto/
├── api/
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── docker-compose.yml
├── init.sql
└── README.md
```

## 🛠️ Tecnologias Utilizadas

- **Node.js 18** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL 15** - Banco de dados
- **Docker Compose** - Orquestração de containers
- **PgAdmin** - Interface para gerenciar o banco

## 🏃‍♂️ Como Executar

### 1. Clonar/Preparar os arquivos
Certifique-se de ter todos os arquivos na estrutura correta.

### 2. Subir os serviços
```bash
docker compose up -d
```

### 3. Verificar se está funcionando
```bash
# Ver status dos containers
docker compose ps

# Ver logs da API
docker compose logs api

# Ver logs do banco
docker compose logs db
```

### 4. Testar a API
- **API Principal:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **Lista de Produtos:** http://localhost:3000/produtos
- **PgAdmin:** http://localhost:8080 (admin@email.com / admin123)

## 📋 Endpoints da API

### GET /
Teste básico da API
```json
{
  "message": "🚀 API Node.js funcionando!",
  "status": "success",
  "timestamp": "2024-03-15T10:30:00.000Z"
}
```

### GET /health
Verifica se API e banco estão funcionando
```json
{
  "status": "healthy",
  "api": "✅ Online",
  "database": "✅ Conectado",
  "timestamp": "2024-03-15T10:30:00.000Z"
}
```

### GET /produtos
Lista todos os produtos
```json
{
  "success": true,
  "count": 8,
  "produtos": [...]
}
```

### POST /produtos
Criar novo produto
```bash
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Produto Novo",
    "preco": 99.90,
    "categoria": "Categoria"
  }'
```

### GET /produtos/:id
Buscar produto específico

### PUT /produtos/:id
Atualizar produto

### DELETE /produtos/:id
Deletar produto

## 🐳 Comandos Docker Compose Úteis

```bash
# Subir serviços em background
docker compose up -d

# Ver logs em tempo real
docker compose logs -f api

# Parar todos os serviços
docker compose down

# Parar e remover volumes (apaga dados do banco)
docker compose down -v

# Reconstruir containers
docker compose up --build

# Executar comando dentro do container da API
docker compose exec api npm install

# Acessar o container da API
docker compose exec api sh

# Acessar o banco PostgreSQL
docker compose exec db psql -U admin -d loja
```

## 🔧 Troubleshooting

### API não conecta no banco
```bash
# Verificar logs
docker compose logs db
docker compose logs api

# Verificar se o banco está pronto
docker compose exec db pg_isready -U admin
```

### Reinstalar dependências
```bash
# Rebuildar a API
docker compose build api
docker compose up -d
```

### Resetar banco de dados
```bash
# Parar tudo e remover volumes
docker compose down -v

# Subir novamente (vai recriar o banco)
docker compose up -d
```

## 🎯 Para a Apresentação

### Como Arquiteto:
- **Serviços escolhidos:** API Node.js + PostgreSQL + PgAdmin
- **Por quê:** Node.js é simples e rápido, PostgreSQL é robusto, PgAdmin facilita visualização
- **Arquitetura:** API REST conecta no banco, dados persistem em volume Docker

### Como Configurador:
- **Docker Compose:** 3 serviços (api, db, pgadmin)
- **Networks:** Rede customizada para comunicação
- **Volumes:** Persistência dos dados do banco
- **Environment:** Variáveis de configuração
- **Depends_on:** API só sobe depois do banco

### Pontos importantes:
1. **Isolamento:** Cada serviço roda em container próprio
2. **Comunicação:** Serviços se comunicam pelo nome (db, api)
3. **Persistência:** Volume garante que dados não se perdem
4. **Escalabilidade:** Fácil adicionar mais serviços
5. **Desenvolvimento:** Hot reload facilita mudanças

## 🚨 Possíveis Dificuldades

1. **Porta ocupada:** Mudar porta no docker-compose.yml
2. **Banco não inicializa:** Aguardar mais tempo ou verificar logs
3. **API não conecta:** Verificar variáveis de ambiente
4. **Dependências:** npm install pode falhar - reconstruir imagem