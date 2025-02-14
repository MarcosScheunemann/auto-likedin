# Auto-linkedin
Este projeto tem como objetivo fazer os seguintes passos:
1 - Ima IA procure um assuntos na internet.
2 - Dentre os assuntos encontrados, que faça uma lista de 10 assuntos mais importantes.
3 - Faça uma mini pesquisa pra ver qual dos 10 assuntos é mais relevante no dia de hoje.
4 - Puxe exemplos anteriores de postagens a partir de um RAG, para ter um padrão de escrita pessoal e humanizado.
5 - Elabore uma postagem no linkedin.
6 - Com o texto pronto, vai agendar a publicação pra algum horário do dia seguinte, utilizando Linkedin API, para que o cliente consiga ver a postagem que será feita com pelo menos 12 horas de antecedencia para validar.

Obs1: Terá um cron para verificar se tem alguma postagem Agendada, caso não tenha, vai fazer os passos 1 ao 7.
Obs2: Por se tratar de um Open source, todas as variáveis de ambiente serão privadas em um env.
Obs3: Projeto focado em Back-end

# Linguagens, Frameworks e Banco de Dados: 
NodeJS, NestJS, Typescrypt, Python, Firebase(Google Cloud).

# Primeiros passos
npm i
npm start

# Para Develop
npm run start:dev

# Para Publicar
npm run deploy
