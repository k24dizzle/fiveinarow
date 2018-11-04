import React, { Component } from 'react';
import Board from '../board/board.js';
import PrototypeBot from '../../bots/prototype.js';

// TODO: Move history, a list of the previous moves?
// TODO: Statistics
// TODO: Framework for competing bots against each other

class Game extends Component {
  constructor(props) {
    super(props);
    this.w = parseInt(this.props.width);
    this.h = parseInt(this.props.height);
    this.totalArea = this.w * this.h;
    this.threshold = 5;
    this.bot = new PrototypeBot();
    this.state = {
        squares: Array(this.totalArea).fill(null),
        xIsNext: true,
        stepNumber: 0,
        winner: null,
        highlight: []
    }
  }

  resetGame() {
    // Reset the state of the game
    this.setState({
      squares: Array(this.totalArea).fill(null),
      xIsNext: true,
      stepNumber: 0,
      winner: null,
      highlight: []
    });
  }

  handleClick(i, humanMove) {
    // Square was clicked!
    var move = this.state.xIsNext ? "X" : "O";
    var nextMove = this.state.xIsNext ? "O" : "X";
    var win = null;

    const nextSquares = this.state.squares.slice(0);
    if (nextSquares[i] === null) {
      nextSquares[i] = move;
      this.setState({
        squares: nextSquares,
        xIsNext: !this.state.xIsNext,
        stepNumber: this.state.stepNumber + 1
      });
      // console.log("[Game] handleClick " + i);
      if (this.state.winner == null) {
        win = this.checkWin(nextSquares.slice(0));
        if (win !== null) {
          this.setState({
            winner: win['player'],
            highlight: win['squares']
          });
          return;
        }
      }

      // Trigger the bot...
      if (humanMove && win === null) {
        var botMove = this.bot.evaluate(nextSquares, this.w, this.h, this.totalArea, nextMove);
        console.log("Bot Move: " + botMove);
        nextSquares[botMove] = nextMove;
        this.setState({
          squares: nextSquares,
          xIsNext: this.state.xIsNext,
          stepNumber: this.state.stepNumber + 1
        });
        // console.log("[Game] handleClick " + i);
        if (this.state.winner == null) {
          win = this.checkWin(nextSquares.slice(0));
          if (win !== null) {
            this.setState({
              winner: win['player'],
              highlight: win['squares']
            })
          }
        }
      }
    }
  }

  checkWin(squares) {
    var row = this.checkRows(squares);
    if (row) return row;
    var column = this.checkColumns(squares);
    if (column) return column;
    var diagonalDownRight = this.checkDiagonalsDownRight(squares);
    if (diagonalDownRight) return diagonalDownRight;
    var diagonalUpRight = this.checkDiagonalsUpRight(squares);
    if (diagonalUpRight) return diagonalUpRight;
    return null;
  }

  checkStraightLine(squares, iMax, jMax, indexFunction) {
    var combo, curComboValue, comboSquares;
    for (var i  = 0; i < iMax; i++) {
      // Reset!
      combo = 0;
      curComboValue = "";
      comboSquares = [];
      for (var j = 0; j < jMax; j++) {
        var index = indexFunction(i, j);
        var value = squares[index];
        if (value !== null) {
          if (value === curComboValue) {
            combo++;
            comboSquares.push(index);
          } else {
            combo = 1;
            comboSquares = [];
            comboSquares.push(index);
            curComboValue = value;
          }
          if (combo === this.threshold) {
            return {
              'player': curComboValue,
              'squares': comboSquares
            };
          }
        } else {
          // Reset!
          combo = 0;
          curComboValue = "";
          comboSquares = [];
        }
      }
    }
    return null;
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
    var result = null;
    for (var i = 0; i < this.h; i++) {
      result = this.exploreDiagonal(i * this.w, squares, (index) => (
        (index + this.w + 1)
      ));
      if (result != null) {
        return result;
      }
    }
    for (i = 1; i < this.w; i++) {
      result = this.exploreDiagonal(i, squares, (index) => ((index + + this.w + 1)));
      if (result != null) {
        return result;
      }
    }
    return result;
  }

  checkDiagonalsUpRight(squares) {
    var result = null;
    for (var i = 0; i < this.h; i++) {
      result = this.exploreDiagonal(i * this.w + (this.w - 1), squares,
        (index) => (
          (index + this.w - 1)
        )
      );
      if (result != null) {
        return result;
      }
    }
    for (i = 0; i < (this.w - 1); i++) {
      result = this.exploreDiagonal(i, squares,
        (index) => (
          (index + this.w - 1)
        )
      );
      if (result != null) {
        return result;
      }
    }
    return result;
  }

  isWithinOneOf(a, b) {
    return a === b || a === (b - 1) || a === (b + 1);
  }

  exploreDiagonal(index, squares, indexFunction) {
    // Given a starting index of a diagonal, explores down that path
    var combo, curComboValue, comboSquares;
    var prevIndexMod = index % this.w;
    while (index < this.totalArea && this.isWithinOneOf(prevIndexMod, index % this.w)) {
      var value = squares[index];
      if (value !== null) {
        if (value === curComboValue) {
          combo++;
          comboSquares.push(index);
        } else {
          combo = 1;
          comboSquares = [];
          comboSquares.push(index);
          curComboValue = value;
        }
        if (combo === this.threshold) {
          return {
            'player': curComboValue,
            'squares': comboSquares
          };
        }
      } else {
        // Reset!
        combo = 0;
        curComboValue = "";
        comboSquares = [];
      }
      // Update the index
      prevIndexMod = index % this.w;
      index = indexFunction(index);
    }
    return null;
  }

  render() {
    var showWinner = "";
    // if (this.state.winner !== null) {
    //   showWinner = "Winner: " + this.state.winner;
    // }
    return (
      <div>
            <Board
              squares={this.state.squares}
              highlight={this.state.highlight} // Highlighted squares on a win
              height={this.h} width={this.w}
              onClick={i => this.handleClick(i, true)}
            />
            <button onClick={() => this.resetGame()}> Reset Game </button>
            <div> {showWinner} </div>
      </div>);
  }
}

export default Game;
