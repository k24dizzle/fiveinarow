import React, { Component } from 'react';
import Board from '../board/board.js';
import PrototypeBot from '../../bots/prototype.js';
import { checkWin } from '../../utils/gameLogic.js';
import './game.css';

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
        win = checkWin(nextSquares.slice(0), this.w, this.h, this.threshold);
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
          win = checkWin(nextSquares.slice(0), this.w, this.h, this.threshold);
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
            <button
              className="reset"
              onClick={() => this.resetGame()}> Reset Game
            </button>
            <div> {showWinner} </div>
      </div>);
  }
}

export default Game;
