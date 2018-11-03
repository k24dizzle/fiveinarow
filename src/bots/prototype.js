class PrototypeBot {
  evaluate(squares) {
    // Given the board and player, return the best move based on some stuff

    /**
      Priorities:
      Open 4: XXXX - can win the game right there
      Closed 4: XXXX - can win the game right there
      Open 3: XXX - can win the game soon...
      Closed 3: XXX - can win the game soon..
      Open 2: XX - potential
      Closed 2: XX - potential
      Open 1: X - less potential
      Closed 1: X - less potential

      Blocking:
      Open 4: XXXX - Nothing we can do here... try I guess
      Closed 4: XXXX - Prevent the loss!
      Open 3: XXX - Prevent the loss!
      Closed 3: XXX - Ehhh, not too urgent
      Open 2: XX - potential
      Closed 2: XX - lesser potential

      Two methods, one for attack, one for blocking...
      Should we implement minimax?
    */
    return null;
  }
}

export default PrototypeBot;
