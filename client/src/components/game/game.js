import React, { Component } from 'react';
import Board from '../board/board.js';
import PrototypeBot from '../../bots/prototype.js';
import { checkWin } from '../../utils/gameLogic.js';
import './game.css';
import SocketContext from '../socket-context.js'

class Game extends Component {
  constructor(props) {
    super(props);
    this.w = parseInt(this.props.width);
    this.h = parseInt(this.props.height);
    this.threshold = 5;
    this.bot = new PrototypeBot();
    this.state = {
        squares: Array(this.w * this.h).fill(null),
        myTimeToMove: true,
        stepNumber: 0,
        winner: null,
        highlight: [],
        moves: [],
        replayIndex: null,
        playerXScore: 0,
        playerOScore: 0,

        room: false,
    }

    this.playerOnePiece = "X";
    this.playerTwoPiece = "O";
  }

  componentDidMount() {
    var roomName = window.location.pathname.substring(1);
    if (roomName !== "") {
      this.props.socket.emit('joinRoom', roomName);
      // An attempt was made to join a room
      this.setState({
        room: true,
        playerXScore: 0,
        playerOScore: 0,
      });
    }
  
    this.props.socket.on('declareMove', function(msg){
      console.log('client declareMove: ' + msg);
      console.log(this);
      this.handleClick(msg['index'], msg['humanMove']);
    }.bind(this));

    this.props.socket.on('roomCreated', function(roomName) {
      console.log('ROOM CREATED %s', roomName);
      window.history.pushState('page2', 'Title', '/' + roomName);
      // reset the bot score
      this.setState({
        playerXScore: 0,
        playerOScore: 0,
        room: true,
      });
    }.bind(this));

    this.props.socket.on('roomDenied', function(roomName) {
      console.log('roomDenied %s', roomName);
      window.history.pushState('page2', 'Title', '/');
      this.setState({
        room: false,
      });
    }.bind(this));

    this.props.socket.on('roomUpdated', function(data) {
      console.log("[Client] Someone joined this room");
      console.log(data);
      if(data['clients'].length >= 2) {
        // Two clients are in the room, somehow signal that a game can be started and who's move is it first
      }
    });
  }

  resetGame() {
    // Reset the state of the game
    this.setState({
      squares: Array(this.w * this.h).fill(null),
      myTimeToMove: true,
      stepNumber: 0,
      winner: null,
      highlight: [],
      moves: [],
      replayIndex: null,
    });
  }

  createGame() {
    this.props.socket.emit('createGame');
  }

  goBack() {
    if (this.state.winner !== null && this.state.replayIndex >= 0) {
      const nextSquares = this.state.squares.slice(0);
      nextSquares[this.state.moves[this.state.replayIndex]] = null;
      this.setState({
        squares: nextSquares,
        replayIndex: this.state.replayIndex - 1,
        highlight: [],
      });
    }
  }

  goForward() {
    if (this.state.winner !== null && this.state.replayIndex < (this.state.moves.length - 1)) {
      const nextSquares = this.state.squares.slice(0);
      let move = ((this.state.replayIndex + 1) % 2 === 0) ? this.playerOnePiece : this.playerTwoPiece;
      nextSquares[this.state.moves[this.state.replayIndex + 1]] = move;

      var winningMoves = [];
      if (this.state.replayIndex + 1 === this.state.moves.length - 1) {
        // Probably could make this logic better
        winningMoves = checkWin(nextSquares.slice(0), this.w, this.h, this.threshold)["squares"];
      }

      this.setState({
        squares: nextSquares,
        replayIndex: this.state.replayIndex + 1,
        highlight: winningMoves
      });
    }
  }

  handleWinner(squares, nextMoves) {
    if (this.state.winner == null) {
      var win = checkWin(squares.slice(0), this.w, this.h, this.threshold);
      if (win !== null) {
        if (win['player'] === this.playerOnePiece) {
          this.setState({
            playerXScore: this.state.playerXScore + 1,
          });
        } else {
          this.setState({
            playerOScore: this.state.playerOScore + 1,
          });
        }
        this.setState({
          winner: win['player'],
          highlight: win['squares'],
          replayIndex: nextMoves.length - 1,
        });
        return true;
      } else {
        return false;
      }
    }
  }

  handleClick(i) {
    if (this.state.winner !== null) {
      return;
    }
    if (this.state.squares[i] === null) {
      this.props.socket.emit('handleMove', {
        index: i,
      });
    }

    var move = this.playerOnePiece;
    var nextMove = this.playerTwoPiece;

    const nextSquares = this.state.squares.slice(0);
    let nextMoves = this.state.moves.slice(0);
    if (nextSquares[i] === null && this.state.winner === null) {
      nextSquares[i] = move;
      nextMoves = nextMoves.concat([i]);
      this.setState({
        squares: nextSquares,
        myTimeToMove: !this.state.myTimeToMove,
        stepNumber: this.state.stepNumber + 1,
        moves: nextMoves
      });
      // console.log("[Game] handleClick " + i);
      if (this.handleWinner(nextSquares, nextMoves)) { return; }

      // Trigger the bot...
      if (this.state.room === false) {
        var botMove = this.bot.evaluate(nextSquares, this.w, this.h, this.totalArea, nextMove);
        console.log("Bot Move: " + botMove);
        nextSquares[botMove] = nextMove;
        nextMoves = nextMoves.concat([botMove]);
        this.setState({
          squares: nextSquares,
          myTimeToMove: this.state.myTimeToMove,
          stepNumber: this.state.stepNumber + 1,
          moves: nextMoves
        });
        // console.log("[Game] handleClick " + i);
        if (this.handleWinner(nextSquares, nextMoves)) { return; }
      }
    }
  }

  render() {
    // TODO: Move Panel out to its own component
    return (
      <div className="gameContainer">
        <div className="boardContainer">
        <Board
          squares={this.state.squares}
          highlight={this.state.highlight} // Highlighted squares on a win
          height={this.h} width={this.w}
          onClick={i => this.handleClick(i)}
        />
        </div>
        <div className="gamePanel">
          <div className="infoPanel">
            <div className="playerInfo">
              <div className="playerScore">{this.state.playerXScore}</div>
              <div className="playerName">Player X</div>
            </div>
            <div className="playerInfo">
              <div className="playerScore">{this.state.playerOScore}</div>
              <div className="playerName">Player O</div>
            </div>
          </div>
          <div className="controlPanel">
            <button
              className="create coolButton"
              onClick={() => this.createGame()}> Create Game
            </button>
            <button
              className="reset coolButton"
              onClick={() => this.resetGame()}> Reset Game
            </button>
            <div className={(this.state.winner !== null) ? "replay" : "replay hidden"}>
              <button
                className="back moveButton"
                onClick={()=> this.goBack()}> 
                  <i className="fas fa-chevron-left"></i>
              </button>
              <button
                className="forward moveButton"
                onClick={()=> this.goForward()}>
                  <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const GameSocket = props => (
  <SocketContext.Consumer>
    {socket => <Game {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default GameSocket;
