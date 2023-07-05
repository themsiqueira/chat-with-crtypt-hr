# Aplicativo de Chat com Criptografia DH e RC4/SDES

Este é um projeto de um aplicativo de chat em tempo real que implementa criptografia usando o protocolo de troca de chaves Diffie-Hellman (DH) e permite ao usuário escolher entre os algoritmos de criptografia RC4 ou SDES para criptografar o conteúdo das mensagens. O aplicativo utiliza o Socket.io para a comunicação bidirecional entre o cliente (frontend) e o servidor (backend). O cliente frontend é desenvolvido em React, enquanto o servidor backend é implementado em Node.js usando o framework Express.

## Funcionamento

O aplicativo de chat utiliza o protocolo Diffie-Hellman (DH) para estabelecer uma chave secreta compartilhada entre os usuários que desejam trocar mensagens de forma segura. O DH permite que os usuários gerem uma chave secreta compartilhada sem transmitir diretamente a chave pela rede. A chave secreta é usada para criptografar e descriptografar as mensagens trocadas.

Quando um usuário entra no aplicativo de chat, ele gera um par de chaves DH: uma chave pública e uma chave privada. A chave pública é enviada para o servidor, que a compartilha com os outros usuários conectados. Quando dois usuários desejam iniciar uma conversa, eles trocam suas chaves públicas. Em seguida, cada usuário combina sua chave privada com a chave pública do outro usuário para gerar a chave secreta compartilhada.

Uma vez que a chave secreta compartilhada é estabelecida entre dois usuários, eles podem optar por criptografar o conteúdo de suas mensagens usando um dos algoritmos disponíveis: RC4 ou SDES. O usuário escolhe o algoritmo e fornece a chave necessária. O conteúdo da mensagem é criptografado usando o algoritmo escolhido e a chave compartilhada.

No lado do servidor, as mensagens recebidas são verificadas para garantir que foram enviadas por usuários autenticados e que a chave secreta compartilhada está estabelecida. Em seguida, o servidor realiza a descriptografia das mensagens usando o algoritmo correspondente (RC4 ou SDES) e a chave compartilhada. As mensagens descriptografadas são enviadas de volta para todos os clientes conectados, permitindo que a conversa ocorra em tempo real.

## Configuração

Para executar o aplicativo de chat com criptografia DH e RC4/SDES, siga as etapas abaixo:

### Pré-requisitos

- Node.js instalado (versão 10 ou superior)
- NPM (Node Package Manager)

### Passos

1. Instale as dependências do servidor backend:

   ```
   cd server
   npm install
   ```

2. Inicie o servidor backend:

   ```
   npm start
   ```

   O servidor será executado na porta 3000.

3. Em outro terminal, navegue até o diretório do cliente frontend:

   ```
   cd ../client
   ```

4. Instale as dependências do cliente frontend:

   ```
   npm install
   ``

`

7. Inicie o cliente frontend:

   ```
   npm start
   ```

   O cliente será executado na porta 4000.

8. Abra seu navegador e acesse `http://localhost:4000` para visualizar o aplicativo de chat.

## Personalização

Você pode personalizar a implementação da criptografia e dos algoritmos RC4 e SDES no aplicativo de chat de acordo com suas necessidades. No cliente frontend em React, localizado no diretório `client/src/assets/js`, você pode modificar a implementação dos algoritmos de criptografia RC4 e SDES, bem como adicionar recursos adicionais para estender a funcionalidade do aplicativo de chat. No servidor backend, localizado no diretório `server`, você pode adicionar verificações de segurança adicionais e personalizar a lógica de criptografia e descriptografia das mensagens.
