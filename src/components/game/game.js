import React, { Component } from 'react';
import Board from '../board/board.js';

class Game extends Component {
  constructor(props) {
    super(props);
    this.w = parseInt(this.props.width);
    this.h = parseInt(this.props.height);
    this.totalArea = this.w * this.h;

    this.state = {
        squares: Array(this.totalArea).fill(null),
        xIsNext: true,
        stepNumber: 0,
        winner: null
    }
  }

  handleClick(i) {
    // Square was clicked!
    var move = this.state.xIsNext ? "X" : "O";
    const nextSquares = this.state.squares.slice(0);
    if (nextSquares[i] === null) {
      nextSquares[i] = move;
      this.setState({
        squares: nextSquares,
        xIsNext: !this.state.xIsNext,
        stepNumber: this.state.stepNumber + 1
      })
      console.log("[Game] handleClick " + i);
      var win = this.checkWin(nextSquares.slice(0));
      if (win !== null) {
        this.setState({
          winner: win['player']
        })
      }
    }
  }

  checkWin(squares) {
    var row = this.checkRows(squares);
    var column = this.checkColumns(squares);
    var diagonalDownRight = this.checkDiagonalsDownRight(squares);
    var diagonalUpRight= this.checkDiagonalsUpRight(squares);

    if (row) {
      return row;
    } else if (column) {
      return column;
    } else if (diagonalDownRight) {
      return diagonalDownRight;
    } else if (diagonalUpRight) {
      return diagonalUpRight;
    }
    return null;
  }

  checkRows(squares) {
    return this.checkHelper(squares, (i, j) => (i * this.h + j), (i) => (0));
  }
  checkColumns(squares) {
    return this.checkHelper(squares, (i, j) => (j * this.w + i), (i) => (0));
  }
  checkDiagonalsDownRight(squares) {
    var firstHalf = this.checkHelper(squares, (i, j) => (i + (j * (this.w + 1))), (i) => (0));
    var secondHalf = this.checkHelper(squares, (i, j) => ((j * this.w) + this.w + j - i), (i) => (i));
    return firstHalf || secondHalf;
  }
  checkDiagonalsUpRight(squares) {
    var newSquares = [];
    for (var i = 0; i < this.w; i++) {
      newSquares = newSquares.concat(squares.slice(i*this.w, i*this.w+this.w).reverse());
    }
    return this.checkDiagonalsDownRight(newSquares);
  }

  checkHelper(squares, fun, jfun) {
    // Check if the game is over
    var combo = 0;
    var curComboValue = "";
    var comboSquares = [];
    var threshold = 5; // 5 in a row to win
    // Go every diagonal, every row, every column
    for (var i = 0; i < this.h; i++) {
      for (var j = jfun(i); j < this.w; j++) {
        var index = fun(i, j);
        // console.log("Diagonal: " + i + " " + index);
        if (index < this.totalArea && index >= 0 && squares[index] != null) {
          // console.log("Diagonal: " + i + " " + index);
          if (squares[index] === curComboValue) {
            combo++;
            comboSquares.push(index);
          } else {
            combo = 1;
            comboSquares.push(index);
            curComboValue = squares[index];
          }
          if (combo === threshold) {
            return {
              'player': curComboValue,
              'squares': comboSquares
            };
          }
        } else {
          combo = 0;
          comboSquares = [];
          curComboValue = "";
        }
      }
      // Reset!
      combo = 0;
      curComboValue = "";
    }
    return null;
  }

  debug(squares) {
    for (var i = 0; i < this.totalArea; i++) {
      if (squares[i] != null) {
        console.log(i + " " + squares[i]);
      }
    }
  }

  render() {
    var showWinner = "";
    if (this.state.winner !== null) {
      showWinner = "Winner: " + this.state.winner;
    }
    return (
      <div>
            <Board
              squares={this.state.squares}
              height={this.h} width={this.w}
              onClick={i => this.handleClick(i)}
            />
            <span> {showWinner} </span>
      </div>);
  }
}

export default Game;
