import React, { Component } from 'react';
import './App.css';
import Board from '../board/board.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1> Five in a row! </h1>
        <div className="boardContainer">
          <Board height="15" width="15" />
        </div>
      </div>
    );
  }
}

export default App;
