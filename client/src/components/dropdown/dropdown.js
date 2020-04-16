import React, { Component } from 'react';
import './dropdown.css';

class Dropdown extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    dropdownClick() {
        console.log("Dropdown click");
    }

    render() {
        return (
            <div className={(this.props.roomName === null) ? "test" : "hidden"}>
                <button
                    className="coolButton"
                    onClick={this.dropDownClick}
                >
                    Bot Difficulty
                </button>

                {
                    this.props.bots.map((e, i) => {
                        return (
                            <div
                            className="dropdownOption"
                            key={i}
                            >
                                test
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}
  
export default Dropdown;
  