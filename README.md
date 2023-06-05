## projeto para a disciplina de experiência criativa do terceiro período de engenharia de software na pucpr

### alunos:

- eduardo babinski

- joão guilherme squaris merlin

- lucas philippe nunes de lima

- pedro henrique pereira

- pedro henrique frickes lasmar santana

## instalação

### pré-requisitos

- [node.js](https://nodejs.org/)

- [mysql](https://www.mysql.com/)

- [yarn](https://yarnpkg.com/getting-started/install)

## passos

clonar repositório

    git clone https://github.com/Caslus/bodyfit

entrar na pasta

    cd bodyfit

instalar dependências

    yarn install

configurar .env

    DATABASE_URL= url do banco de dados
    NEXTAUTH_SECRET= segredo para autenticação
    NEXTAUTH_URL= url da autenticação (provavelmente local)
    GPT_URL= url do chat gpt
    GPT_TOKEN= token do chat gpt

criar e popular banco de dados

    yarn reset

### iniciar ambiente de desenvolvimento

    yarn dev
