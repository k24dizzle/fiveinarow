import React, { Component } from 'react';
import './App.css';
import Game from '../game/game.js';
import io from "socket.io-client";
import SocketContext from '../socket-context.js'

const socket = io(window.location.hostname + ":443");

class App extends Component {
  render() {
    // this.callApi();
    return (
      <SocketContext.Provider value={socket}>
        <div className="App">
          <div className="gameContainer">
            <Game height="15" width="15"/>
          </div>
        </div>
      </SocketContext.Provider>
    );
  }
}

export default App;
