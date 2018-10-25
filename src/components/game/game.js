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
  }
  render() {
    return <Board
              squares={this.state.squares}
              height="10" width="10"
              onClick={i => this.handleClick(i)}
            />;
  }
}

export default Game;
