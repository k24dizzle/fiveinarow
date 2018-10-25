import React, { Component } from 'react';
import Square from '../square/square.js';
import './board.css';

class Board extends Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        handleClick={() => this.props.onClick(i)}
      />
    )
  }

  generateBoard() {
    var width = parseInt(this.props.width);
    var height = parseInt(this.props.height);
    var heightArray = Array.from(Array(height),(x,i)=>i);
    var widthArray = Array.from(Array(width),(x,i)=>i);
    return (
      <div className="board">
          {
            heightArray.map((e, i) => {
              return (
                <div className="row" key={i}>
                  {
                    widthArray.map((test, index) => {
                        return this.renderSquare(index + (i * width));
                    })
                  }
                </div>);
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
