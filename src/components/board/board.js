import React, { Component } from 'react';
import './board.css';

class Board extends Component {
    generateTable() {
      var height = Array.from(Array(parseInt(this.props.height)),(x,i)=>i);
      var width = Array.from(Array(parseInt(this.props.width)),(x,i)=>i);
      var row = width.map((e, i) => {
        return (<td key={i}>NBA</td>)
      });
      return (
        <table>
          <tbody>
            {
              height.map((e, i) => {
                return (<tr key={i}>{ row }</tr>);
              })
            }
          </tbody>
        </table>
      );
    }

    render() {
      var table = this.generateTable();
      return (
        <div className="Board">
          <h1> Board </h1>
          { table }
        </div>
      );
    }
}

export default Board;
