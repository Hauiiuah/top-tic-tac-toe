//Function Pattern
const Player = (name, symbol) => {
  const _symbol = symbol;

  const getSymbol = () => _symbol;
  const sayName = () => {
    console.log(`My Name is ${name}`);
  };

  return { sayName, getSymbol };
};

// Module Pattern IIFE  => Singleton
const GameBoard = (() => {
  const clearGameBoard = () => ["", "", "", "", "", "", "", "", ""];

  let _gameBoard = clearGameBoard();
  let _player = [];
  let _currentPlayer = 0;
  let _possibleMoves = 9;

  let _board;
  let _resetButton;
  let _startButton;
  let _player1field;
  let _player2field;

  const clearBoard = () => {
    _gameBoard = clearGameBoard();
    _currentPlayer = 0;
    _board.innerHTML = "";
  };

  const switchPlayer = () => {
    _currentPlayer = _currentPlayer ? 0 : 1;
  };
  const clickField = (fieldIndex) => {
    _gameBoard[fieldIndex] = _player[_currentPlayer].getSymbol();
    switchPlayer();
    renderBoard();
  };

  const startGame = () => {
    _player.push(Player(_player1field.value, "X"));
    _player.push(Player(_player2field.value, "O"));

    disableUI(true);
    _possibleMoves = 9;
    renderBoard();
  };

  const disableUI = (val) => {
    _player1field.disabled = val;
    _player2field.disabled = val;
    _startButton.disabled = val;
    _resetButton.disabled = !val;
  };

  const resetGame = () => {
    _possibleMoves = 9;
    disableUI(false);
    clearBoard();
  };

  const init = (
    gameBoard,
    player1field,
    player2field,
    startButton,
    resetButton
  ) => {
    _board = document.getElementById(gameBoard);
    _player1field = document.getElementById(player1field);
    _player2field = document.getElementById(player2field);

    _startButton = document.getElementById(startButton);
    _resetButton = document.getElementById(resetButton);

    _startButton.addEventListener("click", startGame);
    _resetButton.addEventListener("click", resetGame);

    _resetButton.disabled = true;
  };

  const renderBoard = () => {
    _board.innerHTML = "";
    _gameBoard.forEach((field, index) => {
      let f = document.createElement("div");

      f.innerText = _gameBoard[index];
      f.innerText ? f.classList.add("deselect") : f.classList.add("field");

      if (!field) {
        f.addEventListener("click", () => clickField(index));
      }

      _board.appendChild(f);
    });

    checkForWinner();
    if (_possibleMoves < 1) {
      setWinner("tie");
    }
  };

  const setWinner = (winner) => {
    if (winner === undefined) return;
    clearBoard();
    disableUI(false);
    let banner = document.createElement("div");
    banner.classList.add("winnerBanner");
    let message = document.createElement("p");
    if (winner === "tie") {
      message.innerText = `TIE!`;
    } else {
      message.innerText = `Winner is ${winner}`;
    }

    banner.appendChild(message);
    _board.appendChild(banner);
  };

  const check = (i, j, k) => {
    if (_gameBoard[i] === _gameBoard[j] && _gameBoard[i] === _gameBoard[k]) {
      if (_gameBoard[i] !== "") {
        setWinner(_gameBoard[i]);
      }
    }
  };

  const checkForWinner = () => {
    _possibleMoves -= 1;
    // rows
    for (let i = 0; i <= 6; i += 3) {
      check(i, i + 1, i + 2);
    }
    //columns
    for (let i = 0; i <= 2; i++) {
      check(i, i + 3, i + 6);
    }
    //diagonal
    check(0, 4, 8);
    check(2, 4, 6);
  };

  return { init };
})();

GameBoard.init(
  "gameBoard",
  "player1Name",
  "player2Name",
  "startGame",
  "resetGame"
);
