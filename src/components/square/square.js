import React, { Component } from 'react';
import './square.css';

class Square extends Component {
    render() {
      return (
        <button className="square" onClick={this.props.handleClick}>
          {this.props.value}
        </button>
      );
    }
}

export default Square;
