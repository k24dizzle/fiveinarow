import React, { Component } from 'react';
import './square.css';

class Square extends Component {
    render() {
      return (
        <div className="square" onClick={this.props.handleClick}>
          {this.props.value}
        </div>
      );
    }
}

export default Square;
