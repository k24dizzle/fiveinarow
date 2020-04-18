import React, { Component } from 'react';
import Square from '../square/square.js';
import './board.css';

class Board extends Component {
  renderSquare(i) {
    var highlight = this.props.highlight.includes(i);
    var cornerValue = "";
    if (i === 0) {
      cornerValue = "top-left";
    } else if (i === (this.width - 1)) {
      cornerValue = "top-right";
    } else if (i === (this.width * this.height - 1)) {
      cornerValue = "bottom-right";
    } else if (i === (this.width * this.height - this.width)) {
      cornerValue = "bottom-left";
    }

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        handleClick={() => this.props.onClick(i)}
        highlight={highlight}
        highlightMove={this.props.lastMove === i}
        corner={cornerValue}
      />
    )
  }

  generateBoard() {
    this.width = parseInt(this.props.width);
    this.height = parseInt(this.props.height);
    var heightArray = Array.from(Array(this.height),(x,i)=>i);
    var widthArray = Array.from(Array(this.width),(x,i)=>i);
    return (
      <div className="board">
          {
            heightArray.map((e, i) => {
              return (
                <div className="row" key={i}>
                  {
                    widthArray.map((test, index) => {
                        return this.renderSquare(index + (i * this.width));
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
