# Para utilizar

## Ciclo

Por conta do Refresh token do linkedin, para realizar a autenticação será necessário, rodar uma vez local, a cada 12 meses.  
(Até o projeto ter um front pra fazer isso por ele).

## Pré-Requisitos de deploy pra cloud

1 - Cadastrar as variáveis de ambientes no arquivo ".env.example", para um arquivo ".env".  
2 - No Arquivo ".env.example" é explicado quais variáveis são "Obrigatórias", e quais as "Opicionais".  
3 - O Programa sozinho vai de 1 em 1 hora, verificar se você possui rascunhos na aba de postagem em sue linkedin([https://www.linkedin.com/feed/](https://www.linkedin.com/feed/)), no campo onde normalmente fica escrito "Comece uma publicação", caso não possua, vai gerar uma publicação novinha pronta pra postagem!  
4 - Você na sua rede vai ter a opção de agendar a publicação/postar/apagar-rascunho, é necessário fazer uma dessas ações para que uma nova postagem seja gerada.  

# For Devs

## Auto-linkedin

Este projeto tem como objetivo fazer os seguintes passos:  
1 - Uma IA procure um assuntos na internet.  
2 - Dentre os assuntos encontrados, que faça uma lista de 10 assuntos mais importantes.  
3 - Faça uma mini pesquisa pra ver qual dos 10 assuntos é mais relevante no dia de hoje.  
4 - Trabalhar no Promt definindo publico-alvo, tipo de abordagem(formal/desconaido).  
5 - Puxe exemplos anteriores de postagens a partir de um RAG, para ter um padrão de escrita pessoal e humanizado.  
6 - Elabore uma postagem no linkedin.  
7 - Com o texto pronto, vai publicar como rascunho, utilizando Linkedin API, para que o cliente consiga ver a postagem que será feita para validar.

## Observações

1 - Terá um cron para verificar se tem alguma postagem Agendada, caso não tenha, vai fazer os passos 1 ao 7.  
2 - Por se tratar de um Open source, todas as variáveis de ambiente serão privadas em um env.  
3 - Projeto focado em Back-end.

## Linguagens, Frameworks e Banco de Dados:

NodeJS, NestJS, Typescrypt, Python, Firebase(Google Cloud).

## Primeiros passos

npm install  
npm run dev  

## Para Develop

npm run start:dev

## Para Publicar

npm run deploy
