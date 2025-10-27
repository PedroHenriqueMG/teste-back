
# Documentação do projeto

Entre em cada uma das pastas front e back depois crei um arquivo .env em cada um copie o conteudo do .env.sample dentro dele.

Quando estiver configurando o .env da API descubra o ip da sua maquina e substitua o localhost pelo ip da sua maquina, faça isso ultilizando os seguintes comandos:

MacOS:
```
ipconfig getifaddr en0
```

Linux:
```
hostname -I
```

Windows:

```
ipconfig
```

Agora rode o seguinte comando para subir o banco de dados e a API
```
docker-compose up --build
```

