import React, { Component } from 'react';
import './App.css';
import Game from '../game/game.js';
import io from "socket.io-client";

class App extends Component {
  componentDidMount() {
    const socket = io.connect(window.location.hostname + ":80");
    socket.on('time', function(msg){
      console.log('client time: ' + msg);
    });
  }

  render() {
    // this.callApi();
    return (
      <div className="App">
        <h1 className="header"> Five In A Row! </h1>
        <div className="boardContainer">
          <Game height="15" width="15"/>
        </div>
      </div>
    );
  }
}

export default App;
