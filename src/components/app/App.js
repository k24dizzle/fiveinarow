import React, { Component } from 'react';
import './App.css';
import Game from '../game/game.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1> Five in a row! </h1>
        <div className="boardContainer">
          <Game height="15" width="15"/>
        </div>
      </div>
    );
  }
}

export default App;
