# Define a imagem base (uma versão do Node.js)
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o package.json e o yarn.lock para aproveitar o cache do Docker
# Se você não tiver um arquivo yarn.lock ainda, pode remover "yarn.lock" desta linha.
COPY package.json yarn.lock ./

# Instala as dependências usando o Yarn.
# O '--frozen-lockfile' é uma boa prática para garantir que a instalação
# use exatamente as versões definidas no seu yarn.lock.
RUN yarn install --frozen-lockfile

# Copia o resto do código do seu projeto
COPY . .

# Expõe a porta que sua API usa para se comunicar
EXPOSE 3001

# Comando final para iniciar sua aplicação com Yarn<<<<<<< configurar_docker
CMD [ "node", "src/server.js" ]