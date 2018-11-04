class PrototypeBot {
  constructor() {
    this.scores = {
      '5': {
        'open': 100000,
        'blocked': 100000,
      },
      '4': {
        'open': 10000,
        'blocked': 1000
      },
      '3': {
        'open': 1000,
        'blocked': 100
      },
      '2': {
        'open': 100,
        'blocked': 10
      },
      '1': {
        'open': 10,
        'blocked': 1
      }
    }

    this.playerMult = {
      'X': -1.1, // Should try to block X more
      'O': 1
    }
  }

  checkWin(squares, player) {
    var row = this.checkRows(squares, player);
    // console.log("row " + row);

    var column = this.checkColumns(squares, player);
    // console.log("column " + column);

    var diagonalDownRight = this.checkDiagonalsDownRight(squares, player);
    // console.log("diagonalDownRight " + diagonalDownRight);

    var diagonalUpRight= this.checkDiagonalsUpRight(squares, player);
    // console.log("diagonalUpRight " + diagonalUpRight);

    return row + column + diagonalDownRight + diagonalUpRight;
  }

  checkStraightLine(squares, iMax, jMax, indexFunction) {
    var combo, curComboValue, comboSquares, blockedAtStart;
    var score = 0;
    for (var i  = 0; i < iMax; i++) {
      // Reset!
      combo = 0;
      curComboValue = "";
      comboSquares = [];
      blockedAtStart = true;
      for (var j = 0; j < jMax; j++) {
        var index = indexFunction(i, j);
        var value = squares[index];
        if (value !== null) {
          if (value === curComboValue) {
            combo++;
            comboSquares.push(index);
          } else {
            if (combo.toString() in this.scores && !blockedAtStart) {
              score += this.scores[combo.toString()]['blocked'] * this.playerMult[curComboValue];
            }
            combo = 1;
            comboSquares = [];
            comboSquares.push(index);
            blockedAtStart = (curComboValue !== "") || j === 0;
            curComboValue = value;
          }
        } else {
          // Reset!
          if (combo.toString() in this.scores) {
            if (blockedAtStart) {
              score += this.scores[combo.toString()]['blocked'] * this.playerMult[curComboValue];
            } else {
              score += this.scores[combo.toString()]['open'] * this.playerMult[curComboValue];;
            }
          }
          combo = 0;
          curComboValue = "";
          comboSquares = [];
          blockedAtStart = false; // The next combo will not be blocked at start
        }
      }
      // See if any combos got cut off at the end,
      if (combo.toString() in this.scores) {
        if (!blockedAtStart) {
          score += this.scores[combo.toString()]['blocked'] * this.playerMult[curComboValue];
        }
      }
    }
    return score;
  }

  checkRows(squares) {
    return this.checkStraightLine(squares, this.h, this.w, (i, j) => (
      (i * this.h) + j
    ));
  }

  checkColumns(squares) {
    return this.checkStraightLine(squares, this.w, this.h, (i, j) => (
      (j * this.w) + i
    ));
  }

  checkDiagonalsDownRight(squares) {
    var result = 0;
    for (var i = 0; i < this.h; i++) {
      result += this.exploreDiagonal(i * this.w, squares, (index) => (
        (index + this.w + 1)
      ));
    }
    for (i = 1; i < this.w; i++) {
      result += this.exploreDiagonal(i, squares, (index) => ((index + + this.w + 1)));
    }
    return result;
  }

  checkDiagonalsUpRight(squares) {
    var result = 0;
    for (var i = 0; i < this.h; i++) {
      result += this.exploreDiagonal(i * this.w + (this.w - 1), squares,
        (index) => (
          (index + this.w - 1)
        )
      );
    }
    for (i = 0; i < (this.w - 1); i++) {
      result += this.exploreDiagonal(i, squares,
        (index) => (
          (index + this.w - 1)
        )
      );
    }
    // console.log(result);
    return result;
  }

  isWithinOneOf(a, b) {
    return a === b || a === (b - 1) || a === (b + 1);
  }

  exploreDiagonal(index, squares, indexFunction) {
    // Given a starting index of a diagonal, explores down that path
    var blockedAtStart = true;
    var combo = 0;
    var curComboValue = "";
    var comboSquares = [];
    var score = 0;
    var prevIndexMod = index % this.w;
    var origIndex = index;
    while (index < this.totalArea && this.isWithinOneOf(prevIndexMod, index % this.w)) {
      var value = squares[index];
      if (value !== null) {
        if (value === curComboValue) {
          combo++;
          comboSquares.push(index);
        } else {
          if (combo.toString() in this.scores && !blockedAtStart) {
            score += this.scores[combo.toString()]['blocked'] * this.playerMult[curComboValue];
          }
          combo = 1;
          comboSquares = [];
          comboSquares.push(index);
          blockedAtStart = (curComboValue !== "") || index === origIndex;
          curComboValue = value;
        }
      } else {
        // Reset!
        if (combo.toString() in this.scores) {
          if (blockedAtStart) {
            score += this.scores[combo.toString()]['blocked'] * this.playerMult[curComboValue];
          } else {
            score += this.scores[combo.toString()]['open'] * this.playerMult[curComboValue];;
          }
        }
        combo = 0;
        curComboValue = "";
        comboSquares = [];
      }
      // Update the index
      prevIndexMod = index % this.w;
      index = indexFunction(index);
    }

    // See if any combos got cut off at the end,
    if (combo.toString() in this.scores) {
      if (!blockedAtStart) {
        score += this.scores[combo.toString()]['blocked'] * this.playerMult[curComboValue];
      }
    }
    return score;
  }

  evaluate(square, width, height, totalArea, move) {
    // Given the board and player, return the best move based on some stuff
    this.w = width;
    this.h = height;
    this.totalArea = totalArea;
    var squares = square.slice(0);

    var minMoveScore = 100000000;
    var minMove = null;
    // for (var i = 0; i < this.totalArea; i++) {
    //   if (squares[i] === null) {
    //     squares[i] = move;
    //     var moveScore = this.checkWin(squares);
    //     if (moveScore < minMoveScore) {
    //       minMoveScore = moveScore;
    //       minMove = i;
    //     }
    //     squares[i] = null;
    //   }
    // }
    // return minMove;
    return this.alphabeta(squares, 2, -Infinity, Infinity, true, move, -1)['move'];
  }

  alphabeta(squares, depth, alpha, beta, player, move, moveIndex) {
    if (depth === 0) {
      return {
        'value': this.checkWin(squares),
        'move': moveIndex
      };
    }
    if (player) {
      var value = -99999999999;
      var valueMove = null;
      for (var i = 0; i < this.totalArea; i++) {
        if (squares[i] === null) {
          squares[i] = move;
          var alphaBetaValue = this.alphabeta(squares, depth - 1, alpha, beta, false, 'X', i);
          if (value < alphaBetaValue['value']) {
            value = alphaBetaValue['value'];
            valueMove = i;
          }
          alpha = Math.max(alpha, value);
          squares[i] = null;
        }
        if (alpha >= beta) {
          break;
        }
      }
      return {
        'value': value,
        'move': valueMove
      };
   } else {
      var value = 10000000000;
      var valueMove = null;
      for (var i = 0; i < this.totalArea; i++) {
        if (squares[i] === null) {
          squares[i] = move;
          var alphaBetaValue = this.alphabeta(squares, depth - 1, alpha, beta, true, 'O', i);
          if (value > alphaBetaValue['value']) {
            value = alphaBetaValue['value'];
            valueMove = i;
          }
          beta = Math.min(beta, value);
          squares[i] = null;
        }
        if (alpha >= beta) {
          break;
        }
      }
      return {
        'value': value,
        'move': valueMove
      };
    }
  }
}

export default PrototypeBot;
