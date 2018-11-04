class PrototypeBot {
  constructor() {
    this.scores = {
      '5': {
        'open': 100000,
        'closed': 100000,
      },
      '4': {
        'open': 10000,
        'closed': 1000
      },
      '3': {
        'open': 1000,
        'closed': 100
      },
      '2': {
        'open': 100,
        'closed': 10
      },
      '1': {
        'open': 10,
        'closed': 1
      }
    }
  }

  checkWin(squares, player) {
    console.log('checkWin');
    var row = this.checkRows(squares, player);
    console.log("row " + row);

    var column = this.checkColumns(squares, player);
    console.log("column " + column);

    var diagonalDownRight = this.checkDiagonalsDownRight(squares, player);
    console.log("diagonalDownRight " + diagonalDownRight);

    var diagonalUpRight= this.checkDiagonalsUpRight(squares, player);
    console.log("diagonalUpRight " + diagonalUpRight);

    return row + column + diagonalDownRight + diagonalUpRight;
  }

  checkRows(squares, player) {
    return this.checkHelper(squares, player, (i, j) => (i * this.h + j), (i) => (0));
  }
  checkColumns(squares, player) {
    return this.checkHelper(squares, player, (i, j) => (j * this.w + i), (i) => (0));
  }
  checkDiagonalsDownRight(squares, player) {
    var firstHalf = this.checkHelper(squares, player, (i, j) => (i + (j * (this.w + 1))), (i) => (0));
    var secondHalf = this.checkHelper(squares, player, (i, j) => ((j * this.w) + this.w + j - i), (i) => (i));
    return firstHalf + secondHalf;
  }
  checkDiagonalsUpRight(squares, player) {
    var newSquares = [];
    // Flip the squares so we can use a previous function
    for (var i = 0; i < this.w; i++) {
      newSquares = newSquares.concat(squares.slice(i*this.w, i*this.w+this.w).reverse());
    }
    var result = this.checkDiagonalsDownRight(newSquares, player);
    return result;
  }

  checkHelper(squares, player, fun, jfun) {
    // Check if the game is over
    var combo = 0;
    var curComboValue = "";
    var threshold = 5; // 5 in a row to win
    var score = 0;
    // Go every diagonal, every row, every column
    var playerMultiplier = {
      'X': 1,
      'O': -1
    };
    if (player === 'O') {
      playerMultiplier["O"] = 1;
      playerMultiplier["X"] = -1;
    }

    for (var i = 0; i < this.h; i++) {
      // Reset!
      var closed = true; // Closed at first because of the end
      combo = 0;
      curComboValue = "";
      for (var j = jfun(i); j < this.w; j++) {
        var index = fun(i, j);
        // console.log("Diagonal: " + i + " " + index);

        if (index < this.totalArea && index >= 0 && squares[index] != null) {
          // console.log("Diagonal: " + i + " " + index);
          if (squares[index] === curComboValue) {
            combo++;
          } else {
            // Collect the current score (closed)
            if (combo.toString() in this.scores) {
              if (!closed) {
                score += this.scores[combo.toString()]['closed']  * playerMultiplier[curComboValue];
              }
            }
            combo = 1;
            // Different value, see if the last value was null, then it is open
            closed = (curComboValue == "X" || curComboValue == "O");
            curComboValue = squares[index];
          }
        } else if (squares[index] == null){
          // Collect the current score (openFour)
          if (combo.toString() in this.scores) {
            if (closed) {
              score += this.scores[combo.toString()]['closed']  * playerMultiplier[curComboValue];
            } else {
              score += this.scores[combo.toString()]['open']  * playerMultiplier[curComboValue];
            }
          }
          combo = 0;
          curComboValue = "";
          closed = false;
        } else {
          // The diagonal/row/column is over... collect any combo
          break;
        }
      }

      if (combo.toString() in this.scores) {
        if (!closed) {
          score += this.scores[combo.toString()]['closed']  * playerMultiplier[curComboValue];
        }
      }
    }
    return score;
  }
  evaluate(squares, width, height, totalArea) {
    // Given the board and player, return the best move based on some stuff
    this.w = width;
    this.h = height;
    this.totalArea = totalArea;

    console.log("[PrototypeBot] evaluate");
    console.log(squares);
    return this.checkWin(squares);
  }
}

export default PrototypeBot;
