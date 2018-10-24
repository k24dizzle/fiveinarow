import React, { Component } from 'react';
import Board from '../board/board.js';

class Game extends Component {
  render() {
    return <Board height="15" width="15" />
  }
}

export default Game;
