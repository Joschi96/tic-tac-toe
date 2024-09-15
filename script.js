/**
 * Module for storing gameboard information
 */
const Gameboard = (() => {
  // Private variable to hold the game board state
  let _board = new Array(9);

  // Public method to get a specific cell's value
  const getCell = (num) => _board[num];

  // Public method to set a symbol in a specific cell
  const setSymbol = (num, player) => {
      _board[num] = player.getSign();
  };

  // Public method to clear the game board
  const clear = () => {
      _board.fill(undefined);
  };

  // Public method to print the game board to the console
  const getBoard = () => {
      let displayBoard = '';
      for (let i = 0; i < _board.length; i++) {
          displayBoard += _board[i] ? _board[i] : '_'; // Show symbol or underscore if empty
          displayBoard += (i + 1) % 3 === 0 ? '\n' : ' '; // Add newline every 3 cells
      }
      console.log(displayBoard);
  };

  return {
      getCell,
      setSymbol,
      clear,
      getBoard
  };
})();
/**
 * Factory function to create player objects
 */
const Player = (sign) => {
  let _sign = sign;

  // Public method to get player's sign
  const getSign = () => _sign;

  // Public method to set player's sign
  const setSign = (sign, active) => {
      _sign = sign;
      // Future implementation for DOM interaction
  };

  return {
      getSign,
      setSign
  };
};

/**
 * Module to control the game logic
 */
const gameController = (() => {
  // Initialize players
  const _player1 = Player('X');
  const _player2 = Player('O');

  // Methods to access players
  const getPlayer1 = () => _player1;
  const getPlayer2 = () => _player2;

  // Private method to check for a win by rows
  const _checkForRows = (board) => {
      for (let i = 0; i < 3; i++) {
          const row = [board.getCell(i * 3), board.getCell(i * 3 + 1), board.getCell(i * 3 + 2)];
          if (row.every(cell => cell === 'X') || row.every(cell => cell === 'O')) return true;
      }
      return false;
  };

 // Private method to check for a win by columns
 const _checkForColumns = (board) => {
    for (let i = 0; i < 3; i++) {
        const column = [board.getCell(i), board.getCell(i + 3), board.getCell(i + 6)];
        if (column.every(cell => cell === 'X') || column.every(cell => cell === 'O')) return true;
    }
    return false;
 };

  // Private method to check for a win by diagonals
  const _checkForDiagonals = (board) => {
    const diagonal1 = [board.getCell(0), board.getCell(4), board.getCell(8)];
    const diagonal2 = [board.getCell(6), board.getCell(4), board.getCell(2)];
    return (diagonal1.every(cell => cell === 'X') || diagonal1.every(cell => cell === 'O') ||
        diagonal2.every(cell => cell === 'X') || diagonal2.every(cell => cell === 'O'));
  };

  // Public method to check for a win
  const checkForWin = (board) => {
    return _checkForRows(board) || _checkForColumns(board) || _checkForDiagonals(board);
  };

  // Public method to check for a draw
  const checkForDraw = (board) => {
    // First check if there is a winner
    if (checkForWin(board)) return false;

    // Check if all cells are filled
    for (let i = 0; i < 9; i++) {
        if (board.getCell(i) === undefined) {
            return false; // Return false if any cell is still empty
        }
    }
    return true; // Return true if all cells are filled and no winner
};


  /// Public method to change players' signs
  const changeSign = (sign) => {
    _player1.setSign(sign, true);
    _player2.setSign(sign === 'X' ? 'O' : 'X');
  };

  return {
    getPlayer1,
    getPlayer2,
    checkForWin,
    checkForDraw,
    changeSign,
  }
})();

/**
 * Module to control the display and interaction with the UI
 */
const displayController = (() => {
  // DOM elements
  const gameboardElement = document.querySelector('.gameboard');
  const restartButton = document.getElementById('restart-button');
  const changePlayersButton = document.getElementById('change-players-button');
  const startDialog = document.getElementById('start-dialog');
  const cancelButton = document.querySelector('#cancel-button');
  const formElement = document.querySelector('#form-names');
  const player1Title = document.querySelector('.player1');
  const player2Title = document.querySelector('.player2');
  const winnerDisplay = document.getElementById('winner-display');
  const nextRoundButton = document.getElementById('next-round-button');
  let currentPlayer = gameController.getPlayer1();

  // Private method to display winner message
  const displayWinner = (winner) => {
      winnerDisplay.classList.remove('hidden');
      winnerDisplay.textContent = `Winner: ${winner}`;
      gameboardElement.classList.add('blurred', 'disabled');
      nextRoundButton.classList.remove('hidden');
  };

  // Private method to display draw message
  const displayDraw = () => {
      winnerDisplay.textContent = "It's a draw!";
      winnerDisplay.classList.remove('hidden');
      gameboardElement.classList.add('blurred');
      nextRoundButton.classList.remove('hidden');
  };

  // Event handler for buttons
  const _handleButtonClick = (event) => {
      if (event.target === restartButton) {
          Gameboard.clear();
          renderBoard(Gameboard);
          document.getElementById('x-win-counter').textContent = '0';
          document.getElementById('o-win-counter').textContent = '0';
      } else if (event.target === changePlayersButton) {
          startDialog.showModal();
      } else if (event.target === cancelButton) {
          startDialog.close();
      }
  };

  // Event handler for form submission
  const _handleSubmit = (event) => {
      event.preventDefault();
      const p1Name = document.getElementById('player1').value || 'Player 1';
      const p2Name = document.getElementById('player2').value || 'Player 2';
      updateGameTitle(p1Name, p2Name);
      Gameboard.clear();
      renderBoard(Gameboard);
      startDialog.close();
  };

  // Add event listeners for buttons and form submission
  restartButton.addEventListener('click', _handleButtonClick);
  changePlayersButton.addEventListener('click', _handleButtonClick);
  cancelButton.addEventListener('click', _handleButtonClick);
  formElement.addEventListener('submit', _handleSubmit);

  // Method to update the game title with player names
  const updateGameTitle = (name1, name2) => {
      player1Title.textContent = name1;
      player2Title.textContent = name2;
  };

  // Method to render the game board on the webpage
  const renderBoard = (board) => {
      gameboardElement.innerHTML = ''; // Clear previous board

      // Re-add the winner-display div
      const winnerDisplay = document.createElement('div');
      winnerDisplay.id = 'winner-display';
      winnerDisplay.classList.add('hidden');
      gameboardElement.appendChild(winnerDisplay);

      // Create cells for the game board
      for (let i = 0; i < 9; i++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.textContent = board.getCell(i) ? board.getCell(i) : '';
          cell.dataset.index = i;
          cell.addEventListener('click', () => _handleCellClick(i, board));
          gameboardElement.appendChild(cell);
      }
  };

  // Method to start the next round
  const startNextRound = () => {
      winnerDisplay.textContent = '';
      winnerDisplay.classList.add('hidden');
      gameboardElement.classList.remove('blurred', 'disabled');
      nextRoundButton.classList.add('hidden');
      Gameboard.clear();
      renderBoard(Gameboard);
      currentPlayer = gameController.getPlayer1();
  };

  // Add event listener for the next round button
  nextRoundButton.addEventListener('click', startNextRound);

  const _handleCellClick = (index, board) => {
        // If the cell is already occupied, do nothing
        if (board.getCell(index)) return;

        // Set player's symbol on the clicked cell
        board.setSymbol(index, currentPlayer);

        // Get the cell element
        const cellElement = document.querySelector(`.cell[data-index="${index}"]`);
        cellElement.textContent = currentPlayer.getSign(); // Set the text content to the player's symbol

        // Apply the class based on the current player's sign
        if (currentPlayer.getSign() === 'X') {
            cellElement.classList.add('player-x');
        } else {
            cellElement.classList.add('player-o');
        }

        // Check for win or draw
        if (gameController.checkForWin(board)) {
            setTimeout(() => {
                const playerSign = currentPlayer.getSign().toLowerCase();
                const winCounterDiv = document.getElementById(`${playerSign}-win-counter`);
                winCounterDiv.textContent = parseInt(winCounterDiv.textContent) + 1;
                displayWinner(currentPlayer.getSign());
            }, 100);
            return;
        }

        if (gameController.checkForDraw(board)) {
            setTimeout(displayDraw, 100);
            return;
        }

        // Switch the current player
        currentPlayer = currentPlayer === gameController.getPlayer1() ? gameController.getPlayer2() : gameController.getPlayer1();
    };

  return {
      displayWinner,
      displayDraw,
      renderBoard,
      updateGameTitle
  };
})();

// Initialize the game by rendering the initial empty board
document.addEventListener('DOMContentLoaded', () => {
  Gameboard.clear(); // Clear the board to start fresh
  displayController.renderBoard(Gameboard); // Render the initial empty board
  displayController.updateGameTitle('Player 1', 'Player 2'); // Render automatically updating header

  // Show dialog on page load
  //displayController.showStartDialog();
});