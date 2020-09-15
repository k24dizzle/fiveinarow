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

    componentDidUpdate() {
        this.scrollDown();
    }

    componentDidMount() {
        // TODO: Move this out to game.js
        // have game.js handle all the possible chat updates, it is up to game.js to update the chat log
        // It is up to game.js to reset the chat
        // 1. Chat Recieved (from other player)
        // 2. Room Created (Player X has created room ****, invite another player to [link] to start a game)
        // 3. Player O (Player O has joined room ****)
        this.props.socket.on('chatRecieved', function(data) {
            let value = data['value'];
            let server = data['server'];

            console.log("Chat recieved");
            var chatLog = this.state.chatLog;
            chatLog.push(value);
            var userLog = this.state.userLog;
            if (server) {
                userLog.push(0);
            } else {
                userLog.push(1);
            }

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
            let icon = "";
            if (this.state.userLog[i] === 2) {
              icon = (
                <div className="chatPlayerIcon"><FontAwesomeIcon icon={currentUser} size="xs"/></div>
              );
            } else if (this.state.roomName !== null && this.state.userLog[i] === 1) {
              icon = (
                <div className="chatPlayerIcon"><FontAwesomeIcon icon={otherUser} size="xs"/></div>
              );
            } else if (this.state.roomName !== null) {
                icon = "";
            }

            let msgHtml = "";
            if (this.state.userLog[i] === 0) {
                msgHtml = (
                    <code className="serverMsg">{msg}</code>  
                );
            } else {
                msgHtml = (
                    <div className="msg">{msg}</div>  
                );
            }
            return (
                <div className="chatRow" key={i}>
                {icon}
                {msgHtml}
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
                userLog.push(2);
                this.setState({
                    chatLog: chatLog,
                    userLog: userLog,
                }, this.scrollDown);
                input.value = "";
            }
        }
    }

    render() {
        console.log("FSDLKJFDLK");
        console.log(this.props.expand);
        let size = "";
        if (this.props.expand) {
            size += "larger";
        } else if (this.props.replay) {
            size += "replayMode";
        }
      return (
        <div className={(this.props.roomName === null) ? "chat lobby hidden" : "chat room"}>
            <div className={"chatBox " + size}>
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
  