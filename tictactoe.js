//Function Pattern
const Player = (name, symbol) => {
  const getSymbol = () => symbol;
  const getName = () => name;

  return { getSymbol, getName };
};

const UI = (() => {
  let _board;
  let _resetButton;
  let _startButton;
  let _player1field;
  let _player2field;

  const disableUI = (val) => {
    _player1field.disabled = val;
    _player2field.disabled = val;
    _startButton.disabled = val;
    _resetButton.disabled = !val;
  };

  const drawVictoryBanner = (winnertext) => {
    let banner = document.createElement("div");
    banner.classList.add("winnerBanner");
    let message = document.createElement("p");

    message.innerText = winnertext;

    banner.appendChild(message);
    _board.appendChild(banner);
  };

  const board = () => _board;
  const hideBoard = () => {
    _board.innerHTML = "";
  };
  const getPlayer = () => [
    Player(_player1field.value, "X"),
    Player(_player2field.value, "O"),
  ];
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

    _startButton.addEventListener("click", GameBoard.startGame);
    _resetButton.addEventListener("click", GameBoard.resetGame);

    _resetButton.disabled = true;
  };

  const renderField = (value, index, callback) => {
    let f = document.createElement("div");

    f.innerText = value;
    f.innerText ? f.classList.add("deselect") : f.classList.add("field");

    if (!value) {
      f.addEventListener("click", () => callback(index));
    }

    _board.appendChild(f);
  };

  return {
    disableUI,
    init,
    hideBoard,
    getPlayer,
    renderField,
    board,
    drawVictoryBanner,
  };
})();

// Module Pattern IIFE  => Singleton
const GameBoard = (() => {
  const generateClearGameBoard = () => ["", "", "", "", "", "", "", "", ""];

  let _gameBoard = generateClearGameBoard();
  let _player = [];
  let _currentPlayer = 0;
  let _possibleMoves = 9;

  const clearBoard = () => {
    _gameBoard = generateClearGameBoard();
    _currentPlayer = 0;
    _possibleMoves = 9;
    UI.hideBoard();
  };

  const switchPlayer = () => {
    _currentPlayer = _currentPlayer ? 0 : 1;
  };
  const clickField = (fieldIndex) => {
    _gameBoard[fieldIndex] = _player[_currentPlayer].getSymbol();
    renderBoard();
    if (!checkForWinner()) {
      switchPlayer();
    }
  };

  const startGame = () => {
    _player = UI.getPlayer();

    UI.disableUI(true);

    clearBoard();
    renderBoard();
  };

  const resetGame = () => {
    UI.disableUI(false);
    clearBoard();
  };

  const renderBoard = () => {
    UI.hideBoard();
    _gameBoard.forEach((field, index) => {
      UI.renderField(field, index, clickField);
    });
    if (_possibleMoves < 1) {
      setWinner("tie");
    }
  };

  const setWinner = (winner) => {
    if (winner === undefined) return;

    UI.hideBoard();
    UI.disableUI(false);

    let winnertext =
      winner === "tie"
        ? "TIE"
        : `Winner is ${winner} ( ${_player[_currentPlayer].getName()} )`;

    UI.drawVictoryBanner(winnertext);
  };

  const check = (i, j, k) => {
    if (_gameBoard[i] === _gameBoard[j] && _gameBoard[i] === _gameBoard[k]) {
      if (_gameBoard[i] !== "") {
        setWinner(_gameBoard[i]);
        return true;
      }
    }
    return false;
  };

  const checkForWinner = () => {
    _possibleMoves -= 1;
    let result = false;
    // rows
    for (let i = 0; i <= 6; i += 3) {
      result = result ? true : check(i, i + 1, i + 2);
    }
    //columns

    for (let i = 0; i <= 2; i++) {
      result = result ? true : check(i, i + 3, i + 6);
    }
    //diagonal
    result = result ? true : check(0, 4, 8);
    result = result ? true : check(2, 4, 6);

    return result;
  };

  return { startGame, resetGame };
})();

UI.init("gameBoard", "player1Name", "player2Name", "startGame", "resetGame");
