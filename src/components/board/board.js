import React, { Component } from 'react';
import Square from '../square/square.js';
import './board.css';

class Board extends Component {
  handleClick(e) {
    e.preventDefault();
    console.log("Square was clicked!");
  }

  renderSquare(i) {
    return (
      <Square
        value="N"
        handleClick={this.handleClick}
      />
    )
  }

  generateBoard() {
    var height = Array.from(Array(parseInt(this.props.height)),(x,i)=>i);
    var width = Array.from(Array(parseInt(this.props.width)),(x,i)=>i);
    var row = width.map((e, i) => {
      return this.renderSquare(i);
    });

    return (
      <div className="board">
          {
            height.map((e, i) => {
              return (<div className="row" key={i}> { row }</div>);
            })
          }
      </div>
    );
  }

  render() {
    return this.generateBoard();
  }
}

export default Board;
