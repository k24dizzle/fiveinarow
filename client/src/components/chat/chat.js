import React, { Component } from 'react';
import SocketContext from '../socket-context.js'
import './chat.css';

class Chat extends Component {
    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        var roomName = this.props.roomName;
        if (roomName === null) {
            // chat to everyone
        } else {
            // chat to room
        }
    }

    handleKeyDown(e) {
        console.log('handleKeyDown');
        console.log(e.key);
    }

    render() {
      return (
        <div className="chat">
            Chat goes here
            <br></br>
            {this.props.roomName}
            <input type="text" onKeyDown={this.handleKeyDown}>
            </input>
        </div>
      );
    }
}

const ChatSocket = props => (
    <SocketContext.Consumer>
      {socket => <Chat {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
  
  export default ChatSocket;
  