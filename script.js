/**
 * This module stores the gameboard information
 */
const Gameboard = (() => {
    let _board = new Array(9);
    
    // method of getting specific Cell that UI will render
    const getCell = (num) => _board[num];

    /**
     * change cell's value to players symbol
     * @param num - number of Cell in the array from 0 to 8 starting from top left
     * @param player - the player that changes the cell
     */
    const setSymbol = (num, player) => {
      _board[num] = player.getSign();  
    }

    /**
     * clearing the gameboard
     */
    const clear = () => {
      for (let i = 0; i < _board.length; i++) {
        _board[i] = undefined;
      }
    }

    /**
     * Prints the gameboard in the console
     */
    const getBoard = () => {
      let displayBoard = '';
      for (let i = 0; i < _board.length; i++) {
          displayBoard += _board[i] ? _board[i] : '_'; // Show symbol or underscore if empty
          if ((i + 1) % 3 === 0) displayBoard += '\n'; // Add newline after every 3 cells
          else displayBoard += ' '; // Add space between symbols
      }
      console.log(displayBoard);
    };

    return{
      getCell,
      setSymbol,
      clear,
      getBoard
    };
})();

/**
* This factory sets the logic behind creating and handling players
*/
const Player = (sign) => {
  let _sign = sign;
  const getSign = () => _sign;
  const setSign = (sign, active) => {
    _sign = sign;
    // DOM interaction for setting a Sign will come later on
    // const p = document.querySelector(`.btn-p.${sign.toLowerCase()}`);
    // if(active){
    //    p.classList.add('selected');
    //    p.classList.remove('not-selected');
    // } else {
    //    p.classList.remove('selected');
    //    p.classList.add('not-selected');
    // }
  }

  return{
    getSign,
    setSign
  };
}

/**
* This module controls the game
*/
const gameController =(() => {
  const _player1 = Player('X');
  const _player2 = Player('O');

  const getPlayer1 = () => _player1;
  const getPlayer2 = () => _player2;

  /**
  * Check if player has filled a row
  * If someone filled a row it returns true, else it returns false
  * @param {Gameboard} board - call to gameboard 
  */
  const _checkForRows = (board) => {
    for (let i = 0; i < 3; i++) {
      let row = []
      for (let j = i * 3; j < i * 3 + 3; j++) {
          row.push(board.getCell(j));
      }

      if (row.every(cell => cell == 'X') || row.every(cell => cell == 'O')) {
          return true;
      }
    }
    return false;
  }

  /**
   * Check if player has filles a column
   * If someone filled a column it returns true, else it returns false
   * @param {Gameboard} board - call to gameboard
   */
  const _checkForColumns = (board) => {
    for (let i = 0; i < 3; i++) {
      let column = []
      for (let j = 0; j < 3; j++) {
          column.push(board.getCell(i + 3 * j));
      }

      if (column.every(cell => cell == 'X') || column.every(cell => cell == 'O')) {
          return true;
      }
    }
    return false;
  }

  /**
  * Check if player has filles a column
  * If someone filled a column it returns true, else it returns false
  * @param {Gameboard} board - call to gameboard
  */
 const _checkForDiagonals = (board) => {
    diagonal1 = [board.getCell(0), board.getCell(4), board.getCell(8)];
    diagonal2 = [board.getCell(6), board.getCell(4), board.getCell(2)];
    if (diagonal1.every(cell => cell == 'X') || diagonal1.every(cell => cell == 'O')) {
      return true;
    }
    else if (diagonal2.every(cell => cell == 'X') || diagonal2.every(cell => cell == 'O')) {
      return true;
    }
  }

  /**
  * Checks if the game is a win.
  * If its a win it returns true, else it returns false.
  * @param {Gameboard} board 
  */
  const checkForWin = (board) => {
    if(_checkForRows(board) || _checkForColumns(board) || _checkForDiagonals(board)){
      return true;
    }
    return false;
  }

  /**
  * Checks if the game is a draw.
  * If its a draw it returns true, else it returns false.
  * @param {Gameboard} board 
  */
  const checkForDraw = (board) => {
    if (checkForWin(board)) {
        return false;
    }
    for (let i = 0; i < 9; i++) {
        const cell = board.getCell(i);
        if (cell == undefined) {
            return false;
        }
    }
    return true;
  }

  /**
   * Changes sign of player 1 to 'sign' and the other players to the other sign
   * @param {string} sign - 'X' or 'O'
   */
  const changeSign = (sign) => {
    if (sign == 'X') {
      _player1.setSign('X', true);
      _player2.setSign('O');
    } else if (sign == 'O'){
      _player1.setSign('O', true);
      _player2.setSign('X');
    }
  }

  return {
    getPlayer1,
    getPlayer2,
    checkForWin,
    checkForDraw,
    changeSign,
  }
})();

const displayController =(() => {
  const gameboardElement = document.querySelector('.gameboard'); // Select the gameboard container
  const restartButton = document.querySelector('.game-section button:nth-of-type(1)'); // Select the "Restart" button
  const changePlayersButton = document.querySelector('.game-section button:nth-of-type(2)'); // Select the "Change players" button
  const startDialog = document.getElementById('start-dialog'); // Select the dialog element
  const cancelButton = document.querySelector('#cancel-button'); // Select dialog cancel button
  const formElement = document.querySelector('#form-names'); // Select submit button in form element
  const gameTitle = document.querySelector('.game-title'); // Select updating game header
  const player1Title = document.querySelector('.player1'); // Select player 1 title
  const player2Title = document.querySelector('.player2'); // Select player 2 title
  // const xSymbol = document.querySelector('.symbol-container p:nth-of-type(1)');
  // const oSymbol = document.querySelector('.symbol-container p:nth-of-type(2)');

  let currentPlayer = gameController.getPlayer1();
  let player1Name = 'Player 1'; // Default player names
  let player2Name = 'Player 2';

  

  /**
    * Handle button clicks for "Restart" and "Change players" and dialog button "Cancel"
    */
  const _handleButtonClick = (event) => {
    if (event.target === restartButton) {
        // Handle "Restart" button click
        Gameboard.clear(); // Clear the gameboard array
        renderBoard(Gameboard); // Re-render the gameboard visually
        // reset win counters
        document.getElementById('x-win-counter').textContent = '0'; 
        document.getElementById('o-win-counter').textContent = '0';
    } else if (event.target === changePlayersButton) {
        // Handle "Change players" button click
        startDialog.showModal(); // Show the dialog for changing players
    } else if (event.target === cancelButton) {
        // Handle "Cancel" button click
        startDialog.close(); // Close the dialog for changing players
    }
  };

  const _handleSubmit = (event) =>{
    event.preventDefault(); // Prevent default form submission

    //Retrieve form values
    const p1Name = document.getElementById('player1').value || player1Name;
    const p2Name = document.getElementById('player2').value || player2Name;

    //Update game header with player names
    updateGameTitle(p1Name, p2Name);

    Gameboard.clear(); // clear gameboard array
    renderBoard(Gameboard); // Re-render the gameboard visually

    startDialog.close();
  };

  // Add event listeners for buttons
  restartButton.addEventListener('click', _handleButtonClick);
  changePlayersButton.addEventListener('click', _handleButtonClick);
  cancelButton.addEventListener('click', _handleButtonClick);
  formElement.addEventListener('submit', _handleSubmit);

  /**
   * Update the game header to display player names
   */
  const updateGameTitle = (name1, name2) => {
    player1Title.textContent = name1; // Set player 1 name
    player2Title.textContent = name2; // Set player 2 name
  };

  /**
   * Render the gameboard to the webpage
   */
  const renderBoard = (board) => {
    // Clear the previous board
    gameboardElement.innerHTML = '';

    // Iterate through the gameboard array and create cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div'); // Create a new div for each cell
        cell.classList.add('cell'); // Add the 'cell' class for styling
        cell.textContent = board.getCell(i) ? board.getCell(i) : ''; // Display 'X', 'O', or empty
        cell.dataset.index = i;

        // Add click event listener for each cell
        cell.addEventListener('click', () => _handleCellClick(i, board));
        gameboardElement.appendChild(cell); // Append each cell to the gameboard container
    }

  };

  /**
   * Handle click events on the cells
   * @param {number} index - The index of the cell clicked
   * @param {object} board - The Gameboard object
   */
  const _handleCellClick = (index, board) => {
    // If the cell is already occupied, do nothing
    if (board.getCell(index)) {
      return;
    }

    // Set players symbol on clicked cell
    board.setSymbol(index, currentPlayer);

    // Add class to the cell based on the current player's symbol
    const cellElement = document.querySelector(`.cell[data-index="${index}"]`);
    if (currentPlayer === gameController.getPlayer1()) {
      cellElement.classList.add('player-x');
    } else {
      cellElement.classList.add('player-o');
    }

    // Update the cell's text content
    cellElement.textContent = currentPlayer.getSign();

    // Render the updated board
    // renderBoard(board);

    // Check for win or draw
    if(gameController.checkForWin(board)) {
      setTimeout(() => {
        // Update the win counter
        const playerSign = currentPlayer.getSign().toLowerCase();
        const winCounterDiv = document.getElementById(`${playerSign}-win-counter`);
        let winCount = parseInt(winCounterDiv.textContent, 10);
        winCounterDiv.textContent = ++winCount;

        board.clear(); // Clear the board after a win
        renderBoard(board); // Re-render the cleared board
      }, 100);
      return;
    }
    if (gameController.checkForDraw(board)) {
      setTimeout(() => {
        alert("It's a draw!");
        board.clear(); // Clear the board after a draw
        renderBoard(board); // Re-render the cleared board
      }, 100);
      return;
    }

    /**
   * Switch the current player
   */
    currentPlayer = currentPlayer === gameController.getPlayer1() ? gameController.getPlayer2() : gameController.getPlayer1();
  };

  const showStartDialog = () => {
    startDialog.showModal();
  };

  return {
    renderBoard,
    updateGameTitle,
    showStartDialog,
  }
})();

// Initialize the game by rendering the initial empty board
document.addEventListener('DOMContentLoaded', () => {
  Gameboard.clear(); // Clear the board to start fresh
  displayController.renderBoard(Gameboard); // Render the initial empty board
  displayController.updateGameTitle('Player 1', 'Player 2'); // Render automatically updating header

  // Show dialog on page load
  //displayController.showStartDialog();
});