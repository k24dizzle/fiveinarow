import React, { Component } from 'react';
import './App.css';
import Game from '../game/game.js';
import io from "socket.io-client";
import SocketContext from '../socket-context.js'

const socket = io(window.location.hostname + ":443");

class App extends Component {
  componentDidMount() {
    socket.on('time', function(msg){
      console.log('client time: ' + msg);
    });
  }

  render() {
    // this.callApi();
    return (
      <SocketContext.Provider value={socket}>
        <div className="App">
          <h1 className="header"> Five In A Row! </h1>
          <div className="boardContainer">
            <Game height="15" width="15"/>
          </div>
        </div>
      </SocketContext.Provider>
    );
  }
}

export default App;
