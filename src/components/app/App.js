import React, { Component } from 'react';
import './App.css';
import Board from '../board/board.js';

class App extends Component {
  render() {
  	console.log("Board");
  	console.log(Board);
    return (
      <div className="App">
        <h1> Five in a row! </h1>
        <Board height="25" width="25" />
      </div>
    );
  }
}

export default App;
