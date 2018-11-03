import React, { Component } from 'react';
import './square.css';

class Square extends Component {
    render() {
      // console.log(this.props);
      return (
        <button
          className={"square" + (this.props.highlight ? " highlight" : "")}
          onClick={this.props.handleClick}>
          {this.props.value}
        </button>
      );
    }
}

export default Square;
