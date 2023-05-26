# Pong-Multiplayer

O que foi feito:

Foi desenvolvido o jogo PONG multijogador pela web, com a comunicação feita a partir da biblioteca Socket.io. O jogo funciona para dois jogadores em tempo real, aonde cada um escolhe
o lado em que vai jogar e selecionam o botão 'Ready' quando estiverem prontos. Quando ambos os jogadores estiverem prontos, o jogo é iniciado. A interface do jogador foi feita por meio
de HTML e CSS, com a utilização da tag canvas para representar a tela do jogo. Toda funcionalidade foi desenvolvida com Javascript, com um servidor 'server.js' autoritário, que comanda
o andamento do jogo, controla a física e detecta as colisões. O servidor repassa as informações para os players em tempo real por meio do Socket.io. A movimentação dos paddles é pelo
mouse, e a condição de vitória é marcar 9 gols primeiro.
