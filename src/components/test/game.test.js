import Game from '../game/game';

function strToArray(t) {
  var rows = t.split('\n');
  var boardArray = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    for (var j = 0; j < row.length; j++) {
      var c = row[j];
      if (c === '-') {
        boardArray.push(null);
      } else if (c ==='X' || c ==='O') {
        boardArray.push(c);
      }
    }
  }
  return boardArray;
}

function assertBoard(board, width, height, win) {
  var boardArray = strToArray(board);
  var props = {
    width: width,
    height: height
  };
  var g = new Game(props);
  var s = g.checkWin(boardArray);
  var expected = s == null ? s : s['player'];
  expect(expected).toBe(win);
}

test('Test win down right', () => {
  var board = `
  O---------
  -O--------
  --O-------
  ---O------
  ----O-----
  ----------
  ----------
  ----------
  ----------
  ----------`;
  assertBoard(board, 10, 10, 'O');
});

test('Test failed game down right', () => {
  var board = `
  O---------
  -O--------
  --O-------
  ---O------
  ----X-----
  ----------
  ----------
  ----------
  ----------
  ----------`;
  assertBoard(board, 10, 10, null);
});

test('Test win down left', () => {
  var board = `
  O-------X-
  -O-----X--
  --O---X---
  ---O-X----
  ----X-----
  ----------
  ----------
  ----------
  ----------
  ----------`;
  assertBoard(board, 10, 10, 'X');
});

test('Test win down left', () => {
  var board = `
  O-------X-
  -O-----X--
  --O---X---
  ---O-X----
  ----------
  ------X---
  -----X----
  ----X-----
  ---X------
  --X-------`;
  assertBoard(board, 10, 10, 'X');
});

test('Test close call', () => {
  var board = `
  O-------X-
  -O-----X--
  --O---X---
  ---O-X----
  ----------
  X------X--
  X---X-----
  X---X-----
  X--X------
  O---------`;
  assertBoard(board, 10, 10, null);
});

test('Test close call', () => {
  var board = `
  O-------X-
  -O-----X--
  --O---X---
  ---O-X----
  ----------
  X------X--
  X---X-----
  X---X-----
  X--X------
  X---------`;
  assertBoard(board, 10, 10, 'X');
});

test('Test down right', () => {
  var board = `
  ----------
  ----------
  ----------
  ----------
  ----------
  X---------
  -X--------
  --X-------
  ---X------
  ----X-----`;
  assertBoard(board, 10, 10, 'X');
});

test('Test down right 2', () => {
  var board = `
  ---X------
  ----X-----
  -----X----
  ------X---
  -------X--
  ----------
  ----------
  ----------
  ----------
  ----------`;
  assertBoard(board, 10, 10, 'X');
});

test('Test close call down right diagonal', () => {
  var board = `
  X-----O---
  -X-----O--
  --X-----O-
  ---X-----O
  O---O-----
  -----X----
  --O---X---
  ---O------
  ----O-----
  -----O----`;
  assertBoard(board, 10, 10, null);
});

test('Test horizontal', () => {
  var board = `
  XXXXX-----
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------`;
  assertBoard(board, 10, 10, 'X');
});

test('Test horizontal down', () => {
  var board = `
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  XXXXX-----`;
  assertBoard(board, 10, 10, 'X');
});

test('Test vertical', () => {
  var board = `
  ----------
  ----------
  ----------
  ----------
  ----------
  ---------O
  ---------O
  ---------O
  ---------O
  ---------O`;
  assertBoard(board, 10, 10, 'O');
});

test('Test vertical 2', () => {
  var board = `
  X---------
  X---------
  X---------
  X---------
  X---------
  ----------
  ----------
  ----------
  ----------
  ----------`;
  assertBoard(board, 10, 10, 'X');
});

test('Test vertical close call', () => {
  var board = `
  X------O-X
  X---------
  X---------
  X---------
  ----------
  ----------
  X-----O---
  X-----O---
  X-----O---
  X-----O--X`;
  assertBoard(board, 10, 10, null);
});

test('Test blank board', () => {
  var board = `
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------
  ----------`;
  assertBoard(board, 10, 10, null);
});

test('Test down left', () => {
  var board = `
  ----------
  ----------
  ----------
  ----------
  ----------
  -----X----
  ----X-----
  ---X------
  --X-------
  -X--------`;
  assertBoard(board, 10, 10, 'X');
});

test('Test down left 2', () => {
  var board = `
  -----O----
  ----O-----
  ---O------
  --O-------
  -O--------
  ----------
  ----------
  ----------
  ----------
  ----------`;
  assertBoard(board, 10, 10, 'O');
});

test('Test down left close call', () => {
  var board = `
  ----------
  ---X------
  --X-------
  -X--------
  X---------
  ---------X
  ----------
  ----------
  ----------
  ----------`;
  assertBoard(board, 10, 10, null);
});

test('Test idk', () => {
  var board = `
  ----------
  ----------
  -X--X-----
  ---O-O-X--
  ----OOX---
  ----X-X---
  --XX-X-X--
  --X-----X-
  ----------
  ----------`;
  assertBoard(board, 10, 10, null);
});

test('Test stop diagonal overflow down right', () => {
  var board = `
  ----------
  ----------
  ----------
  ------X---
  -------X--
  --------X-
  ---------X
  ----------
  X---------
  ----------`;
  assertBoard(board, 10, 10, null);
});

test('Test stop diagonal overflow up right', () => {
  var board = `
  ----------
  ----------
  ----------
  ----------
  ---O------
  --O-------
  -O--------
  O--------O
  ----------
  ----------`;
  assertBoard(board, 10, 10, null);
});
