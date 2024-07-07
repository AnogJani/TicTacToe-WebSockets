
/*---Custumize-Here---*/
let num = 3;
let infinite = true;
let starting_player = 'O';
/*--------------------*/

let grid = [[]];
let playes = [];
let wid;
let hei;
let turn = starting_player;
let game_counter = 0;
let game_counter_remover = -1*Math.floor(num*num * 2/3);

let socket

function setup() {
  createCanvas(500, 500);
  wid = width/num;
  hei = height/num;
  for (let i = 0 ; i < num ; i++) {
    grid[i] = [];
    for (let j = 0 ; j < num ; j++) {
      grid[i][j] = '';
    }
  }

  socket = io.connect('http://localhost:3000');
  socket.on('click',(data) => {handleClick(data.i,data.j)});
}

function draw() {
  background(220);
  drawBoard();
  
  if (turn == 'X') {stroke(100,100,255);}
  if (turn == 'O') {stroke(255,100,100);}
  textSize(15);
  strokeWeight(1);
  text(`${turn}'s turn`,10,height-10);
  
  declareWinner(checkEnd());
}

function mouseClicked() {
  let i = floor(mouseX/wid);
  let j = floor(mouseY/hei);
  if (grid[i][j] != '') {return;} //if cell already taken
  let data = {i:i,j:j}
  socket.emit('click',data);
  handleClick(i,j);
}

function handleClick(i,j) {
  grid[i][j] = turn;
  playes.push(createVector(i,j));
  if (game_counter_remover >= 0) {
    let remover_i = playes[game_counter_remover].x;
    let remover_j = playes[game_counter_remover].y;
    grid[remover_i][remover_j] = '';  
  }
  game_counter++;
  if (infinite) {game_counter_remover++};
  switchTurn();
}

function switchTurn() {
  if (turn == 'X') {turn = 'O';return;}
  if (turn == 'O') {turn = 'X';return;}
}

function drawBoard () {
  strokeWeight(2);
  noFill();
  
  //lines
  for (let count = 0 ; count < num ; count++) {
    stroke(0);
    line(count*wid,0,count*wid,height);
    line(0,count*hei,width,count*hei);
  }
  
  //X's & O's
  strokeWeight(4);
  for (let index = max(0,game_counter_remover) ; index < playes.length ; index++) {
    let i = playes[index].x;
    let j = playes[index].y;
    let mark_size = min(wid/2,hei/2);
    let alpha = (game_counter_remover == index) ? (floor(frameCount/25))%2*150 : 255;
    if (grid[i][j] == 'X') {
      stroke(100,100,255,alpha);
      push();
      translate(i*wid+mark_size,j*hei+mark_size);
      rotate(PI/4);
      line(-mark_size/2,0,mark_size/2,0);
      line(0,-mark_size/2,0,mark_size/2);
      pop();
    }
    if (grid[i][j] == 'O') {
      stroke(255,100,100,alpha);
      circle(i*wid+mark_size,j*hei+mark_size,mark_size);
    }
  }
}

function checkEnd() {
  
  //Rows & Cols
  for (let i = 0 ; i < num ; i++) {
    let count = 0;
    let countOther = 0;
    for (let j = 0 ; j < num ; j++) {
      if (grid[i][j] == 'X') {count--}
      if (grid[i][j] == 'O') {count++}
      if (grid[j][i] == 'X') {countOther--}
      if (grid[j][i] == 'O') {countOther++}
    }
    if (count == -num || countOther == -num) {return 'X'}
    if (count == num || countOther == num) {return 'O'}
  }
  
  //Diagonals
  let countDiag = 0;
  let countOtherDiag = 0;
  for (let k = 0 ; k < num ; k++) {
    if (grid[k][k] == 'X') {countDiag--}
    if (grid[k][k] == 'O') {countDiag++}
    if (grid[num-k-1][k] == 'X') {countOtherDiag--}
    if (grid[num-k-1][k] == 'O') {countOtherDiag++}
  }
  if (countDiag == -num || countOtherDiag == -num) {return 'X'}
  if (countDiag == num || countOtherDiag == num) {return 'O'}
  
  //Draw
  let count = 0;
  for (let i = 0 ; i < num ; i++) {
    for (let j = 0 ; j < num ; j++) {
      if (grid[i][j]) {count++}
    }
    if (count == sq(num)) {return 'DRAW'}
  }
}

function declareWinner(winner) {
  if (!winner) {return;}
  if (winner == 'DRAW') {
    console.log('DRAW MY DUDE'); 
  } else {
    console.log(winner + ' IS THE WINNER');
  }
  noLoop();
}



/*------FLOOR-BUMP------*/