import React, { Component } from 'react';
import Board from '../board/board.js';
import PrototypeBot from '../../bots/prototype.js';
import { checkWin } from '../../utils/gameLogic.js';
import './game.css';
import SocketContext from '../socket-context.js'

class Game extends Component {
  constructor(props) {
    super(props);
    console.log("GAME");
    console.log(this.props);
    this.w = parseInt(this.props.width);
    this.h = parseInt(this.props.height);
    this.totalArea = this.w * this.h;
    this.threshold = 5;
    this.bot = new PrototypeBot();
    this.state = {
        squares: Array(this.totalArea).fill(null),
        xIsNext: true,
        stepNumber: 0,
        winner: null,
        highlight: [],
        moves: [],
        replayIndex: null,
        playerX: false,
        playerO: false,
        playerXScore: 0,
        playerOScore: 0,
    }

    this.playerOnePiece = "X";
    this.playerTwoPiece = "O";
  }

  componentDidMount() {
    this.props.socket.on('declareMove', function(msg){
      console.log('client declareMove: ' + msg);
      console.log(this);
      this.handleClick(msg['index'], msg['humanMove']);
    }.bind(this));
  }

  resetGame() {
    // Reset the state of the game
    this.setState({
      squares: Array(this.totalArea).fill(null),
      xIsNext: true,
      stepNumber: 0,
      winner: null,
      highlight: [],
      moves: [],
      replayIndex: null,
      playerX: false,
      playerO: false,
    });
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

  handleClick(i, humanMove) {
    if (this.state.squares[i] === null) {
      this.props.socket.emit('handleMove', {
        index: i,
        humanMove: humanMove,
      });
    }
    // Square was clicked!
    var move = this.state.xIsNext ? this.playerOnePiece : this.playerTwoPiece;
    var nextMove = this.state.xIsNext ? this.playerTwoPiece : this.playerOnePiece;
    var win = null;

    const nextSquares = this.state.squares.slice(0);
    let nextMoves = this.state.moves.slice(0);
    if (nextSquares[i] === null && this.state.winner === null) {
      nextSquares[i] = move;
      nextMoves = nextMoves.concat([i]);
      this.setState({
        squares: nextSquares,
        xIsNext: !this.state.xIsNext,
        stepNumber: this.state.stepNumber + 1,
        moves: nextMoves
      });
      // console.log("[Game] handleClick " + i);
      if (this.handleWinner(nextSquares, nextMoves)) {
        return;
      }
      // Trigger the bot...
      if (humanMove) {
        var botMove = this.bot.evaluate(nextSquares, this.w, this.h, this.totalArea, nextMove);
        console.log("Bot Move: " + botMove);

        nextSquares[botMove] = nextMove;
        nextMoves = nextMoves.concat([botMove]);
        this.setState({
          squares: nextSquares,
          xIsNext: this.state.xIsNext,
          stepNumber: this.state.stepNumber + 1,
          moves: nextMoves
        });
        // console.log("[Game] handleClick " + i);
        if (this.handleWinner(nextSquares, nextMoves)) {
          return;
        }
      }
    }
  }

  selectPlayerX() {
    console.log(this.state.playerX);
    this.setState({
      playerX: !this.state.playerX,
      playerO: null,
    });
  }

  selectPlayerO() {
    this.setState({
      playerX: null,
      playerO: !this.state.playerO,
    });
  }

  render() {
    // For the bottomBar, used this to align the elements correctly:
    // https://stackoverflow.com/questions/38948102/center-and-right-align-flexbox-elements
    return (
      <div className="gameContainer">
        <div className="boardContainer">
        <Board
              squares={this.state.squares}
              highlight={this.state.highlight} // Highlighted squares on a win
              height={this.h} width={this.w}
              onClick={i => this.handleClick(i, true)}
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
              className="reset"
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
