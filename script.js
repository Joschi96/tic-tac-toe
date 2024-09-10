/**
 * This module stores the gameboard information
 */
const Gameboard = (() => {
    let _board = new Array(9);
    
    // method of getting specific Cell that UI will render
    const getCell = (num) => _board[num];

    /**
     * change cell's value to players symbol
     * param num number of Cell in the array from 0 to 8 starting from top left
     * param player the player that changes the cell
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