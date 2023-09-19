# Social Postify

O "Social Postify" é um aplicativo web que permite aos usuários criar e agendar publicações para várias redes sociais, como Facebook, Instagram, Twitter e LinkedIn. Os usuários podem criar publicações personalizadas com imagens, títulos, texto e selecionar a data e horário específicos para cada publicação. O sistema suporta o agendamento de várias publicações e fornece uma visão geral clara das postagens programadas.

# Sobre este Projeto

O gerenciamento das atividades de mídia social, economiza tempo, melhora a consistência do conteúdo e permite que os usuários atinjam seu público de maneira mais estratégica.

Este projeto possui 3 rotas:
- Medias
- Posts
- Publications

Em cada uma delas, é possível adicionar um novo elemento, buscar todos os dados, buscar um dado específico por ID, atualizar algumas informações de um elemento e apagar um elemento. Além disso, foram realizados testes de integração para cada uma das rotas, utilizando ferramentas como Faker, Jest e Supertest, com o intuito de garantir a qualidade do aplicativo.

# Tecnologias

As seguintes ferramentas e estruturas foram utilizadas na construção deste projeto:

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

# Como executar

1. Clone este repositório
2. Instale as dependências
```bash
npm i
```
3. Copie o arquivo .env.example, configure-o e renomeie-o para .env
4. Aplique as migrações do Prisma ao banco de dados
```bash
npx prisma migrate dev
```
5. Por fim, rode o back-end com
```bash
npm run start
```

## Como rodar os testes

1. Copie o arquivo .env.test.example, configure-o e renomeie-o para .env.test
2. Por fim, rode os testes com o comando
```bash
npm run test:e2e
```
