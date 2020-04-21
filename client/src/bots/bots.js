import AlphabetaBot from './alphabeta.js';

var easyBot = new AlphabetaBot(
  {
    '5': {
      'open': 1000000,
      'blocked': 1000000,
    },
    '4': {
      'open': 10000, // as good as winning...
      'blocked': 1000
    },
    '3': {
      'open': 100,
      'blocked': 100
    },
    '2': {
      'open': 10,
      'blocked': 10
    },
    '1': {
      'open': 10,
      'blocked': 1
    }
  }
);
var mediumBot = new AlphabetaBot(
  {
    '5': {
      'open': 1000000,
      'blocked': 1000000,
    },
    '4': {
      'open': 10000, // as good as winning...
      'blocked': 1000
    },
    '3': {
      'open': 1000,
      'blocked': 100
    },
    '2': {
      'open': 100,
      'blocked': 100
    },
    '1': {
      'open': 10,
      'blocked': 10
    }
  }
);
var hardBot = new AlphabetaBot(
  {
    '5': {
      'open': 1000000,
      'blocked': 1000000,
    },
    '4': {
      'open': 100000, // as good as winning...
      'blocked': 1000
    },
    '3': {
      'open': 1000,
      'blocked': 100
    },
    '2': {
      'open': 100,
      'blocked': 10
    },
    '1': {
      'open': 10,
      'blocked': 1
    }
  }
);
export {
    easyBot,
    mediumBot,
    hardBot,
};