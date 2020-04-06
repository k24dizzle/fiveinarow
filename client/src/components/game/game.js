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
        replayIndex: null
    }

    this.playerOnePiece = "X";
    this.playerTwoPiece = "O";

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
      replayIndex: null
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

  recieveClick(gameState) {

  }

  handleClick(i, humanMove) {
    this.props.socket.emit('handleMove', {
      index: i,
      humanMove: humanMove,
    });
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
      if (this.state.winner == null) {
        win = checkWin(nextSquares.slice(0), this.w, this.h, this.threshold);
        if (win !== null) {
          this.setState({
            winner: win['player'],
            highlight: win['squares']
          });
          return;
        }
      }

      // Trigger the bot...
      if (humanMove && win === null) {
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
        if (this.state.winner == null) {
          win = checkWin(nextSquares.slice(0), this.w, this.h, this.threshold);
          if (win !== null) {
            this.setState({
              winner: win['player'],
              highlight: win['squares'],
              replayIndex: nextMoves.length - 1
            })
          }
        }
      }
    }
  }

  render() {
    // For the bottomBar, used this to align the elements correctly:
    // https://stackoverflow.com/questions/38948102/center-and-right-align-flexbox-elements
    return (
      <div>
            <Board
              squares={this.state.squares}
              highlight={this.state.highlight} // Highlighted squares on a win
              height={this.h} width={this.w}
              onClick={i => this.handleClick(i, true)}
            />
            <div className="bottomBar">
              <div className={"replay special"}>
                  <button
                    className="back moveButton"> 
                      <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="forward moveButton">
                      <i className="fas fa-chevron-right"></i>
                  </button>
              </div>
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
    );
  }
}

const GameSocket = props => (
  <SocketContext.Consumer>
    {socket => <Game {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default GameSocket;
