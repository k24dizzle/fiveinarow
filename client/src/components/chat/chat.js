import React, { Component } from 'react';
import SocketContext from '../socket-context.js'
import './chat.css';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatLog: [],
        }
    }

    componentDidMount() {
        // TODO: Move this out to game.js
        // have game.js handle all the possible chat updates, it is up to game.js to update the chat log
        // It is up to game.js to reset the chat
        // 1. Chat Recieved (from other player)
        // 2. Room Created (Player X has created room ****, invite another player to [link] to start a game)
        // 3. Player O (Player O has joined room ****)
        this.props.socket.on('chatRecieved', function(value) {
            console.log("Chat recieved");
            var chatLog = this.state.chatLog;
            chatLog.push(value);
            console.log(chatLog);
            this.setState({
                chatLog: chatLog,
            });
        }.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.roomName !== this.props.roomName) {
            console.log("[Room Change, Reset Chat] " + nextProps.roomName + " " + this.state.roomName);
            this.setState({
                chatLog: [],
            });
        }
    }

    renderChatLog() {
        return this.state.chatLog.map(function(msg, i) {
            return (
                <div className="row" key={i}>
                  {msg}
                </div>
            );
        });
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            var input = document.getElementsByClassName('chatInput')[0];
            this.props.socket.emit(
                'chatInput',
                {
                    roomName: this.props.roomName,
                    value: input.value,
                }
            )
            input.value = "";
        }
    }

    render() {
      return (
        <div className={(this.props.roomName === null) ? "chat lobby hidden" : "chat room"}>
            Chat goes here
            <br></br>
            {this.renderChatLog()}
            <input className="chatInput" type="text" onKeyDown={this.handleKeyDown.bind(this)}>
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
  