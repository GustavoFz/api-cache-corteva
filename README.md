<!-- 
<p align="center">
  <a href="http://rical.com.br/" target="blank"><img src="https://rical.com.br/logo.svg" width="200" alt="Logo Rical" /></a>
</p>
-->

  <p align="center">API Rical para integração com a Integra, parceira Corteva.</p>


## Description


## Settings

1. Copie o arquivo odbc.ini-example para odbc.ini e preencha conforme as configurações do seu banco cache. 
2. Copie o arquivo .env-example para .env e preencha as variaveis de ambiente
3. Verifique se a versão do drive ODBC na raiz do projeto é compativel com o seu banco de dados, caso não sejá, adicione o novo drive e altere o arquivo Dockerfile na linha 14 para o novo arquivo.

## Running the app

Para execurtar o mysql e a api em docker, execute os código abaixo:

```bash
# development
$ docker-compose up
```

Para executar apenas o banco de dados em docker, execute o seguinte código:

```bash
# development
$ docker-compose -f docker-compose-mysql.yml up
$ npm run start:prod
```

## License

Nest is [MIT licensed](LICENSE).
