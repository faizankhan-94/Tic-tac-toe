// 🎬 Intro Screen
window.onload = function () {
  setTimeout(() => {
    document.getElementById("intro").style.display = "none";
    document.getElementById("game").style.display = "block";
  }, 4000);
};

const board = document.getElementById("board");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let cells = Array(9).fill("");
let gameMode = "friend";

function setMode(mode) {
  gameMode = mode;

  const friendBtn = document.getElementById("friendBtn");
  const computerBtn = document.getElementById("computerBtn");

  // Remove active class
  friendBtn.classList.remove("active");
  computerBtn.classList.remove("active");

  // Add active class
  if (mode === "friend") {
    friendBtn.classList.add("active");
  } else {
    computerBtn.classList.add("active");
  }

  restartGame();
}

function createBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.innerText = cell;
    div.addEventListener("click", () => handleClick(index));
    board.appendChild(div);
  });
}

function handleClick(index) {
  if (cells[index] !== "") return;

  cells[index] = currentPlayer;
  createBoard();

  if (checkWinner()) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "computer" && currentPlayer === "O") {
    setTimeout(computerMove, 400);
  }
}

function computerMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (cells[i] === "") {
      cells[i] = "O";
      let score = minimax(cells, 0, false);
      cells[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== -1) cells[move] = "O";

  createBoard();
  if (checkWinner()) return;

  currentPlayer = "X";
}


function minimax(boardState, depth, isMaximizing) {
  let result = checkWinnerAI(boardState);

  if (result !== null) {
    const scores = { X: -1, O: 1, draw: 0 };
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  const patterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let p of patterns) {
    const [a,b,c] = p;

    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      statusText.innerText = cells[a] + " Wins!";
      board.style.pointerEvents = "none";

      // 🔥 FORCE CALL
      setTimeout(() => {
        fireCrackers();
      }, 100);

      return true;
    }
  }

  if (!cells.includes("")) {
    statusText.innerText = "Draw!";
    return true;
  }

  return false;
}

function checkWinnerAI(boardState) {
  const p = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let c of p) {
    const [a,b,d] = c;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[d]) {
      return boardState[a];
    }
  }

  if (!boardState.includes("")) return "draw";
  return null;

  if (cells[a] && cells[a] === cells[b] && cells[a] === cells[d]) {
  statusText.innerText = cells[a] + " Wins!";
  board.style.pointerEvents = "none";

  fireCrackers(); // 🎆 ADD THIS

  return true;
}
}

function restartGame() {
  cells = Array(9).fill("");
  currentPlayer = "X";
  statusText.innerText = "";
  board.style.pointerEvents = "auto";
  createBoard();
}


function fireCrackers() {
  if (typeof confetti !== "function") {
    console.log("Confetti not loaded ❌");
    return;
  }

  confetti({
    particleCount: 200,
    spread: 120,
    origin: { y: 0.6 }
  });

  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 150,
      origin: { y: 0.3 }
    });
  }, 300);
}

createBoard();