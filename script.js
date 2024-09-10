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

    return{
      getCell,
      setSymbol,
      clear
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