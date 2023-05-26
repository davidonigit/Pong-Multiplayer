const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const crypto = require('crypto');
const { request } = require('http');

app.use(express.static('public'));

const ballPosition = { x: 800/2, y: 600/2}
const ballDelta = { 
  x: 10,
  y: Math.random() * 10 * 2 - 10,
}

let leftPaddleY
let rightPaddleY

// let playerLeft = false
// let playerRight = false

let players = []
let gameOn = false
let gameOver = false
let gameReady = 0
let scoreLeft = 0
let scoreRight = 0

io.on('connection', (socket) => {
  console.log('a user connected');
  players.push(socket.id)

  socket.on('disconnect', () => {
    let index = players.indexOf(socket.id)
    players.splice(index,1)
    gameReady = 0
    console.log('user disconnected');
  });

  socket.on('choosedPaddle', (side) =>{
    if (side === 'left'){
      playerLeft = true
    } else{
      playerRight = true
    }
  });

  socket.on('playerReady', () =>{
    gameReady += 1
    if(gameReady == 2){
      gameStart()
    }
  })
  
  socket.on('updatePaddle', (data) => {
    if (data.player === 'left') {
      leftPaddleY = data.y;
    } else if (data.player === 'right') {
      rightPaddleY = data.y;
    }
    socket.broadcast.emit('updatePaddle', data);
  });

});

function gameStart(){
  io.emit('gameStarting')
  setTimeout( () => {
    gameOn = true
  }, 3000)
}

function testGameOver(){
  if(scoreLeft == 9 || scoreRight == 9){
    gameOver = true
    if(scoreLeft > scoreRight){
      io.emit('gameOver', 'LEFT')
    }else {
      io.emit('gameOver', 'RIGHT')
    }
  }
}
  
// send ball position every 10ms
setInterval(function(){
  if(gameOn == true && gameOver == false){
    const newx = ballPosition.x + ballDelta.x
    const newy = ballPosition.y + ballDelta.y
    
    ballPosition.x = newx
    ballPosition.y = newy
    
    // Gol
    if(newx >= 800) {
      scoreLeft += 1
      io.emit('updateScore', {scoreLeft: scoreLeft, scoreRight: scoreRight, goalOwner: 'LEFT'})
      ballToCenter('right')
      testGameOver()
    }
    if(newx <= 0) {
      scoreRight += 1
      io.emit('updateScore', {scoreLeft: scoreLeft, scoreRight: scoreRight, goalOwner: 'RIGHT'})
      ballToCenter('left')
      testGameOver()

    }
    // Up and Down colision
    if(newy >= 590 || newy < 0) { 
      ballDelta.y = -ballDelta.y
    }
    // paddle left colision
    if((newx > 0 && newx <= 10) && (newy >= leftPaddleY && newy <= leftPaddleY+100)){
      if(newy < leftPaddleY+50){
        ballDelta.y = Math.random() * ((-5) - (-8) + 1) + (-8)
      }else {
        ballDelta.y = Math.random() * (8 - 5 + 1) + 5
      }
      ballDelta.x = -ballDelta.x
    }
    // paddle right colision
    if((newx < 800 && newx >= 790) && (newy >= rightPaddleY && newy <= rightPaddleY+100)){
      if(newy < rightPaddleY+50){
        ballDelta.y = Math.random() * ((-5) - (-8) + 1) + (-8)
      }else {
        ballDelta.y = Math.random() * (8 - 5 + 1) + 5
      }
      ballDelta.x = -ballDelta.x
    }
  } else {
    // default ball position
    ballPosition.x = 400
    ballPosition.y = 300
    ballDelta.x = 10
    ballDelta.y = 5
  } 
  
  io.emit('updateBall', {ballx: ballPosition.x, bally: ballPosition.y, deltax: ballDelta.x, deltay: ballDelta.y})
}, 10);

function ballToCenter(side) {
  gameOn = false
  setTimeout(() => {
    ballPosition.x = 400
    ballPosition.y = 300
    if(side === 'right'){
      ballDelta.x = 10
      ballDelta.y = Math.random() * (5 - (-5) + 1) + (-5)
    } else {
      ballDelta.x = -10
      ballDelta.y = Math.random() * (5 - (-5) + 1) + (-5)
    }
    gameOn = true
  }, 3000)
}

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});