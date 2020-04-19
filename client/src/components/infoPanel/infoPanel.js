import React, { Component } from 'react';
import './infoPanel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser as currentUser } from '@fortawesome/free-solid-svg-icons'
import { faUser as otherUser } from '@fortawesome/free-regular-svg-icons'

class InfoPanel extends Component {
  render() {
    var playerXIcon = "";
    if (this.props.playerXIcon === "currentPlayer") {
        playerXIcon = (
            <div className="playerIcon"><FontAwesomeIcon icon={currentUser} /></div>
        );
    } else if (this.props.playerXIcon === "otherPlayer") {
      playerXIcon = (
        <div className="playerIcon"><FontAwesomeIcon icon={otherUser} /></div>
      );
    }

    var playerOIcon = "";
    if (this.props.playerOIcon === "currentPlayer") {
      playerOIcon = (
        <div className="playerIcon"><FontAwesomeIcon icon={currentUser} /></div>
      );
    } else if (this.props.playerOIcon === "otherPlayer") {
      playerOIcon = (
        <div className="playerIcon"><FontAwesomeIcon icon={otherUser} /></div>
      );
    }

    return (
        <div className="infoPanel">
            <div className="playerInfo">
            <div className={(this.props.boldPlayerX) ? "playerScore bold" : "playerScore"}>{this.props.playerXScore}</div>
            <div className={(this.props.boldPlayerX) ? "playerName bold" : "playerName"}>Player X</div>
            {playerXIcon}
            </div>
            <div className="playerInfo">
            <div className={(this.props.boldPlayerO) ? "playerScore bold" : "playerScore"}>{this.props.playerOScore}</div>
            <div className={(this.props.boldPlayerO) ? "playerName bold" : "playerName"}>Player O</div>
            {playerOIcon}
            </div>
        </div>
    );
  }
}

export default InfoPanel;
