import React, { Component } from 'react';
import Board from '../board/board.js';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
        squares: Array(225).fill(null),
        xIsNext: true,
        stepNumber: 0
    }
  }

  handleClick(i) {
    // Square was clicked!
    var move = this.state.xIsNext ? "X" : "O";
    const nextSquares = this.state.squares.slice(0);
    nextSquares[i] = move;
    this.setState({
      squares: nextSquares,
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1
    })
    console.log("[Game] handleClick " + i);
    this.checkWin(nextSquares.slice(0));
  }

  checkWin(squares) {
    if (this.checkRows(squares)
        || this.checkColumns(squares)
        || this.checkDiagonalsDownRight(squares)
        || this.checkDiagonalsUpRight(squares)
        ) {
      alert("Winner");
    }
  }

  checkRows(squares) {
    return this.checkHelper(squares, (i, j) => (i * 15 + j), (i) => (0));
  }
  checkColumns(squares) {
    return this.checkHelper(squares, (i, j) => (j * 15 + i), (i) => (0));
  }
  checkDiagonalsDownRight(squares) {
    var firstHalf = this.checkHelper(squares, (i, j) => (i + (j * 16)), (i) => (0));
    var secondHalf = this.checkHelper(squares, (i, j) => ((j * 15) + 15 + j - i), (i) => (i));
    return firstHalf || secondHalf;
  }
  checkDiagonalsUpRight(squares) {
    var copySquares = squares.slice(0);
    var newSquares = [];
    for (var i = 0; i < 15; i++) {
      newSquares = newSquares.concat(squares.slice(i*15, i*15+15).reverse());
    }
    return this.checkDiagonalsDownRight(newSquares);
  }

  checkHelper(squares, fun, jfun) {
    // Check if the game is over
    var combo = 0;
    var curComboValue = "";
    var threshold = 5; // 5 in a row to win
    // Go every diagonal, every row, every column
    for (var i = 0; i < 15; i++) {
      for (var j = jfun(i); j < 15; j++) {
        var index = fun(i, j);
        // console.log("Diagonal: " + i + " " + index);
        if (index < 15 * 15 && index >= 0 && squares[index] != null) {
          // console.log("Diagonal: " + i + " " + index);
          if (squares[index] === curComboValue) {
            combo++;
          } else {
            combo = 1;
            curComboValue = squares[index];
          }
          if (combo === threshold) {
            return true;
          }
        } else {
          combo = 0;
          curComboValue = "";
        }
      }
      // Reset!
      combo = 0;
      curComboValue = "";
    }
    return false;
  }

  debug(squares) {
    for (var i = 0; i < 225; i++) {
      if (squares[i] != null) {
        console.log(i + " " + squares[i]);
      }
    }
  }

  render() {
    return <Board
              squares={this.state.squares}
              height="15" width="15"
              onClick={i => this.handleClick(i)}
            />;
  }
}

export default Game;
