import { checkWin } from 'gameLogic.js';
import { hardBot } from '../bots/prototype.js';

function playGame(botX, botO, squares) {
  var xtomove = true;
  while (checkWin(squares, 15, 15, 5) !== null) {
    if (xtomove) {
      var moveX = botX.evaluate(squares, 15, 15, 'X');
      squares[moveX] = "X";
      console.log("X moves " + moveX);
    } else {
      var moveO = botO.evaluate(squares, 15, 15, 'X');
      squares[moveO] = "O";
      console.log("O moves " + moveO);
    }
  }
  console.log(checkWin(squares, 15, 15, 5));
};

export { playGame };
