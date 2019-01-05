import React, { Component } from 'react';
import './square.css';

class Square extends Component {
    render() {
      var classNames = "square" + (this.props.highlight ? " highlight" : "");
      if (this.props.corner) {
        classNames += (" " + this.props.corner);
      }
      return (
        <button
          className={classNames}
          onClick={this.props.handleClick}>
          {this.props.value}
        </button>
      );
    }
}

export default Square;
