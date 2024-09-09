function Gameboard() {
    const board = [];

    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
          board[i].push(Cell());
        }
    }
    
    // method of getting the entire board that UI will render
    const getBoard = () => board;
}