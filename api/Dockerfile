# api/Dockerfile

# Usar a imagem oficial do Node.js (versão LTS)
FROM node:18-alpine

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json primeiro (para cache de layers)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código da aplicação
COPY . .

# Expor a porta que a aplicação vai usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]