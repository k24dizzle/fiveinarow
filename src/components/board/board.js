import React, { Component } from 'react';
import './board.css';

class Board extends Component {
    generateTable() {
      var height = [0, 1, 2, 3, 4, 5];
      var width = [0, 1, 2, 3, 4, 5];
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
      // var test = <table>;
      // for (var i = 0; i < this.props.height; i++) {
      //  test += "<tr>"
      //  for (var j = 0; j < this.props.width; j++) {
      //    test += "<td> <td/>";
      //  }
      //  test += "<tr/>"
      // }
      // test += "</table>";
      // return test;
    }

    render() {
      var table = this.generateTable();
      return table;
        // return (
        //   <div className="Board">
        //     <h1> Board </h1>
        //   </div>
        // );
    }
}

export default Board;
