import React, { Component } from 'react';
import SocketContext from '../socket-context.js'
import './chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser as currentUser } from '@fortawesome/free-solid-svg-icons'
import { faUser as otherUser } from '@fortawesome/free-regular-svg-icons'

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatLog: [],
            userLog: [],
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
            var userLog = this.state.userLog;
            userLog.push(false);

            this.setState({
                chatLog: chatLog,
                userLog: userLog,
            });

            this.scrollDown();
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
            let icon = ""
            if (this.state.userLog[i]) {
              icon = (
                <div className="playerIcon"><FontAwesomeIcon icon={currentUser} size="xs"/></div>
              );
            } else if (this.state.roomName !== null) {
              icon = (
                <div className="playerIcon"><FontAwesomeIcon icon={otherUser} size="xs"/></div>
              );
            }        
            return (
                <div className="chatRow" key={i}>
                {icon}
                <div className="msg">{msg}</div>
                </div>
            );
        }.bind(this));
    }

    scrollDown() {
        // Scroll to the bottom of the chat
        var div = document.getElementsByClassName("chatBox")[0];
        div.scrollTop = div.scrollHeight - div.clientHeight;
    }
    handleKeyDown(e) {
        if (e.key === 'Enter' ) {
            var input = document.getElementsByClassName('chatInput')[0];
            if (input.value.trim() !== "") {
                this.props.socket.emit(
                    'chatInput',
                    {
                        roomName: this.props.roomName,
                        value: input.value,
                    }
                )
                var chatLog = this.state.chatLog;
                chatLog.push(input.value);
                var userLog = this.state.userLog;
                userLog.push(true);
                this.setState({
                    chatLog: chatLog,
                    userLog: userLog,
                }, this.scrollDown);
                input.value = "";
            }
        }
    }

    render() {

      return (
        <div className={(this.props.roomName === null) ? "chat lobby hidden" : "chat room"}>
            <div className="chatBox">
                {this.renderChatLog()}
            </div>
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
  