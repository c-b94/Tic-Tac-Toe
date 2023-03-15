setInterval(() => tick(), 1000);
const gameBoard = document.querySelector("#board");
let boardSize = document.querySelector("#board-size").value;
const startButton = document.querySelector("#start-button");
const computerToggle = document.querySelector("#computer-player-switch");
const playerOne = document.querySelector("#player1");
const playerTwo = document.querySelector("#player2");
const playerOneArea = document.getElementById("player-1-area");
const playerTwoArea = document.getElementById("player-2-area");
const roundNumber = document.getElementById("round-number");
let NUMBEROFCELLS = boardSize ** 2;
let namePlayerOne = playerOne.id;
let namePlayerTwo = playerTwo.id;
let currentPlayer = playerOne.id;

const gameState = {
  players: [playerOne, playerTwo],
  playerOneWin: false,
  playerTwoWin: false,
  scratch: false,
  computerPlayerOn: false,
  boardIsEmpty: true,
  playerOneScore: 0,
  playerTwoScore: 0,
  totalRounds: 0,
  currentRound: 0,
  ingameBoardSize: 0,
  game: [],
  game2D: [],
  gameStarted: false,
};

startButton.addEventListener("click", clickStart);
computerToggle.addEventListener("click", isComputerPlaying);
gameBoard.addEventListener("click", placepiece);
function submitName() {
  if (playerOne.value !== "") {
    let name = playerOne.value;
    playerOne.value = "";
    namePlayerOne = name;
    playerOneArea.children[0].innerHTML = namePlayerOne;
  }
  if (gameState.computerPlayerOn === false) {
    if (playerTwo.value !== "") {
      let name = playerTwo.value;
      playerTwo.value = "";
      namePlayerTwo = name;
      playerTwoArea.children[0].innerHTML = namePlayerTwo;
    } else {
      playerTwoArea.children[0].innerHTML = playerTwo.id;
    }
  }
}
function isComputerPlaying(event) {
  if (gameState.gameStarted === false) {
    if (computerToggle.checked === true) {
      namePlayerTwo = "Computer";
      playerTwoArea.children[0].innerHTML = namePlayerTwo;
      gameState.computerPlayerOn = true;
      let p2pic = playerTwoArea.children[1];
      p2pic.setAttribute("src", "computer player.svg");
    } else {
      namePlayerTwo = playerTwo.id;
      playerTwoArea.children[0].innerHTML = namePlayerTwo;
      let p2pic = playerTwoArea.children[1];
      p2pic.setAttribute("src", "player 2 sus.svg");
      gameState.computerPlayerOn = false;
    }
  }
}
function clickStart(event) {
  event.preventDefault();
  if (gameState.gameStarted === false) {
    submitName();
    buildBoard();
    gameState.totalRounds = document.getElementById("rounds-menu").value;
    gameState.currentRound = 1;
    firstPlayer();
    gameState.gameStarted = true;
    gameState.boardIsEmpty = true;
  }
}

function tick() {
  boardSize = document.querySelector("#board-size").value;
  NUMBEROFCELLS = boardSize ** 2;
  playerOneArea.children[2].innerHTML = gameState.playerOneScore;
  playerTwoArea.children[2].innerHTML = gameState.playerTwoScore;
  roundNumber.innerHTML = gameState.currentRound;
  if (gameState.gameStarted === true) {
    if (gameState.computerPlayerOn === true) {
      if (currentPlayer === playerTwo.id) {
        computerPlayer();
      }
    }
  }
}

function firstPlayer() {
  //random seed for who plays first
  let seed = Math.random();
  if (seed >= 1 / 2) {
    currentPlayer = playerTwo.id;
    playerTwoArea.children[0].style.textDecoration = "5px underline";
    if (gameState.computerPlayerOn === true) {
      let seed = Math.floor(Math.random() * NUMBEROFCELLS);
      placePieceComputer(gameState.game[seed]);
    }
  } else {
    playerOneArea.children[0].style.textDecoration = "5px underline";
  }
}
function currentPlayerSwitch() {
  //switch players
  switch (currentPlayer) {
    case playerOne.id:
      if (gameState.computerPlayerOn === true) {
        computerPlayer();
      }
      currentPlayer = playerTwo.id;
      playerOneArea.children[0].style.textDecoration = "none";
      playerTwoArea.children[0].style.textDecoration = "5px underline";
      break;
    case playerTwo.id:
      currentPlayer = playerOne.id;
      playerTwoArea.children[0].style.textDecoration = "none";
      playerOneArea.children[0].style.textDecoration = "5px underline";

      break;
  }
  return currentPlayer;
}

function clearBoard() {
  //clears board and resets
  let divCount = document.querySelectorAll("#board div").length;
  for (let i = 0; i < divCount; i++) {
    const divRm = document.querySelector("#board div");
    divRm.remove();
  }
  NUMBEROFCELLS = 0;
  gameState.playerOneWin = false;
  gameState.playerTwoWin = false;
  gameState.game = [];
  gameState.game2D = [];
  computerToggle.checked = false;
  gameState.boardIsEmpty = true;
}
function buildBoard() {
  //genrates the board,and calls clearBoard()
  clearBoard();
  NUMBEROFCELLS = boardSize ** 2;
  gameState.ingameBoardSize = NUMBEROFCELLS;
  gameBoard.style.setProperty(
    "grid-template-columns",
    `repeat(${boardSize},1fr)`
  );
  gameBoard.style.setProperty("grid-template-rows", `repeat(${boardSize},1fr)`);
  for (let i = 0; i <= NUMBEROFCELLS; i++) {
    gameBoard.append(document.createElement("div"));
  }
  let arr = Array.from(gameBoard.childNodes);
  gameState.game = arr.slice(1, arr.length - 1);
  build2DArray();
}
function playerpiece(cell) {
  //assigns letter to players,
  //and prevents overwritting.
  //player switches.

  if (cell.id === "") {
    cell.id = currentPlayer;
    if (cell.id === playerOne.id) {
      currentPlayerSwitch();
      cell.append(document.createElement("p"));
      return (cell.firstChild.innerText = "X");
    }
    if (cell.id === playerTwo.id) {
      currentPlayerSwitch();
      cell.append(document.createElement("p"));
      return (cell.firstChild.innerText = "O");
    }
  }
}

function placepiece(event) {
  //when a div is clicked ,
  //it is tied to a player id.
  //the player piece is called.
  if (gameState.gameStarted === true) {
    let cell = event.target;
    if (cell.tagName === "DIV") {
      playerpiece(cell);
    }
    gameState.boardIsEmpty = false;
    checkIfWin();
  }
}

function checkBoardRows(arr) {
  //curently counts pieces regardles on same row
  const rowLength = Math.sqrt(gameState.ingameBoardSize);
  for (row of arr) {
    let p1count = 0;
    let p2count = 0;
    for (let i = 0; i < row.length; i++) {
      if (row[i].id === playerOne.id) {
        p1count++;

        if (p1count === rowLength) {
          return (gameState.playerOneWin = true);
        }
      }
      if (row[i].id === playerTwo.id) {
        p2count++;

        if (p2count === rowLength) {
          return (gameState.playerTwoWin = true);
        }
      }
    }
  }
}
function checkBoardColumns(arr) {
  const columnLength = Math.sqrt(gameState.ingameBoardSize);

  for (let i = 0; i < columnLength; i++) {
    let p1count = 0;
    let p2count = 0;
    for (piece of arr) {
      if (piece[i].id === playerOne.id) {
        p1count++;
        if (p1count === columnLength) {
          return (gameState.playerOneWin = true);
        }
      }
      if (piece[i].id === playerTwo.id) {
        p2count++;
        if (p2count === columnLength) {
          return (gameState.playerTwoWin = true);
        }
      }
    }
  }
}
function getBoardDiagnal(arr) {
  const diagnalLength = Math.sqrt(gameState.ingameBoardSize);
  let diagnalOne = [];
  let diagnalTwo = [];
  for (let i = 0; i < diagnalLength; i++) {
    for (piece of arr) {
      let x = arr.indexOf(arr[i]);
      let y = arr.indexOf(piece);

      if (x === y) {
        diagnalOne.push(piece[i]);
      }
    }
  }
  for (let i = diagnalLength - 1; i >= 0; i--) {
    const indexLength = diagnalLength - 1;
    for (piece of arr) {
      let x = i;
      let y = indexLength - arr.indexOf(piece);
      if (x === y) {
        diagnalTwo.push(piece[i]);
      }
    }
  }
  return [diagnalOne, diagnalTwo];
}
function checkBoardDiagnal(arr) {
  let diagnals = getBoardDiagnal(arr);
  for (let diagnal of diagnals) {
    let p1count = 0;
    let p2count = 0;
    for (let i = 0; i < diagnal.length; i++) {
      if (diagnal[i].id === playerOne.id) {
        p1count++;
        if (p1count === diagnal.length) {
          return (gameState.playerOneWin = true);
        }
      }
      if (diagnal[i].id === playerTwo.id) {
        p2count++;
        if (p2count === diagnal.length) {
          return (gameState.playerTwoWin = true);
        }
      }
    }
  }
}
function checkForScratch(arr) {
  if (gameState.playerOneWin === false && gameState.playerTwoWin === false) {
    let stillMoves = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === "") {
        gameState.scratch = false;
        stillMoves = true;
      }
    }
    if (stillMoves === false) {
      gameState.scratch = true;
    }
  }
}
function checkIfWin() {
  checkBoardRows(gameState.game2D);
  checkBoardColumns(gameState.game2D);
  checkBoardDiagnal(gameState.game2D);
  checkForScratch(gameState.game);
  if (gameState.playerOneWin === true) {
    gameState.currentRound = gameState.currentRound + 1;
    gameState.playerOneScore = gameState.playerOneScore + 1;
    alert(`${namePlayerOne} wins round`);
    buildBoard();
    if (gameState.playerOneScore > gameState.totalRounds / 2) {
      gameOver();
    }
  }
  if (gameState.playerTwoWin === true) {
    gameState.currentRound++;
    gameState.playerTwoScore++;
    alert(`${namePlayerTwo} wins round`);
    buildBoard();
    if (gameState.playerTwoScore > gameState.totalRounds / 2) {
      gameOver();
    }
  }
  if (gameState.scratch === true) {
    alert("game scratch");
    buildBoard();
    gameState.scratch = false;
  }
}

function gameOver() {
  if (gameState.playerOneScore > gameState.playerTwoScore) {
    alert(`${namePlayerOne} won the game!`);
  } else {
    alert(`${namePlayerTwo} won the game!`);
  }
  gameState.gameStarted = false;
  gameState.playerOneScore = 0;
  gameState.playerTwoScore = 0;
  gameState.currentRound = 0;
  playerOneArea.children[0].style.textDecoration = "none";
  playerTwoArea.children[0].style.textDecoration = "none";

  clearBoard();
}

function build2DArray() {
  let arr = gameState.game;
  let arr2D = [];
  const dimensionLength = Math.sqrt(gameState.ingameBoardSize);
  for (let i = 0; i < arr.length; i += dimensionLength) {
    let element = [];
    let range = i + dimensionLength;
    for (let k = i; k < range; k++) {
      element.push(arr[k]);
    }
    arr2D.push(element);
  }
  return (gameState.game2D = arr2D);
}

////////////Computer player Brain////////////////////
function checkBoardRowsComputer(arr) {
  //curently counts pieces regardles on same row
  const rowLength = Math.sqrt(gameState.ingameBoardSize);
  let indexOfBestRow = 0;
  let bestRowCount = 0;
  for (row of arr) {
    let p2count = 0;

    for (let i = 0; i < row.length; i++) {
      if (row[i].id === playerOne.id) {
        p2count++;
      }
    }
    if (p2count > bestRowCount) {
      bestRowCount = p2count;
      indexOfBestRow = arr.indexOf(row);
    }
  }
  return { array: arr[indexOfBestRow], count: bestRowCount };
}
function checkBoardColumnsComputer(arr) {
  const columnLength = Math.sqrt(gameState.ingameBoardSize);
  let bestColumnArray = [];
  let bestColumnCount = 0;
  for (let i = 0; i < columnLength; i++) {
    let tempArray = [];
    let p2count = 0;
    for (piece of arr) {
      tempArray.push(piece[i]);
      if (piece[i].id === playerOne.id) {
        p2count++;
      }
    }
    if (p2count > bestColumnCount) {
      bestColumnCount = p2count;
      bestColumnArray = tempArray;
    }
  }
  return { array: bestColumnArray, count: bestColumnCount };
}
function checkBoardDiagnalComputer(arr) {
  let diagnals = getBoardDiagnal(arr);
  let bestDiagnalCount = 0;
  let indexOfBestDiagnal = 0;
  for (let diagnal of diagnals) {
    let p2count = 0;
    for (let i = 0; i < diagnal.length; i++) {
      if (diagnal[i].id === playerOne.id) {
        p2count++;
      }
    }
    if (p2count > bestDiagnalCount) {
      bestDiagnalCount = p2count;
      indexOfBestDiagnal = diagnals.indexOf(diagnal);
    }
  }
  return { array: diagnals[indexOfBestDiagnal], count: bestDiagnalCount };
}
function placePieceComputer(cell) {
  if (currentPlayer === playerTwo.id) {
    if (cell.tagName === "DIV") {
      playerpiece(cell);
    }

    gameState.boardIsEmpty = false;
    checkIfWin();
  }
}

function computerPlayer() {
  let moves = [
    checkBoardColumnsComputer(gameState.game2D),
    checkBoardRowsComputer(gameState.game2D),
    checkBoardDiagnalComputer(gameState.game2D),
  ];
  let bestmovecount = 0;
  let bestMove = [];
  for (let arr of moves) {
    if (arr.count > bestmovecount) {
      bestmovecount = arr.count;
      bestMove = arr.array;
    }
  }
  let seed = Math.floor(Math.random() * 10);
  let nearestIndex = 0;
  let index = bestMove.length;
  bestMove.forEach((element) => {
    if (element.id === "") {
      let distance = bestMove.indexOf(element) - seed;
      if (distance < index) {
        index = distance;
        nearestIndex = bestMove.indexOf(element);
      }
    }
  });
  if (gameState.boardIsEmpty === true) {
    seed = Math.floor(Math.random() * NUMBEROFCELLS);
    placePieceComputer(gameState.game[seed]);
  }
  if (bestMove[nearestIndex].id === "") {
    placePieceComputer(bestMove[nearestIndex]);
  } else {
    let randomSpace = [];
    for (let space of gameState.game) {
      if (space.id === "") {
        randomSpace = gameState.game[gameState.game.indexOf(space)];
      }
    }
    placePieceComputer(randomSpace);
  }
}
