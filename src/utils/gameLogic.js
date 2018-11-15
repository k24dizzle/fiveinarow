function checkWin(squares, w, h, threshold) {
  var row = checkRows(squares, w, h, threshold);
  if (row) return row;
  var column = checkColumns(squares, w, h, threshold);
  if (column) return column;
  var diagonalDownRight = checkDiagonalsDownRight(squares, w, h, threshold);
  if (diagonalDownRight) return diagonalDownRight;
  var diagonalUpRight = checkDiagonalsUpRight(squares, w, h, threshold);
  if (diagonalUpRight) return diagonalUpRight;
  return null;
};

function checkStraightLine(squares, iMax, jMax, threshold, indexFunction) {
  var combo, curComboValue, comboSquares;
  for (var i  = 0; i < iMax; i++) {
    // Reset!
    combo = 0;
    curComboValue = "";
    comboSquares = [];
    for (var j = 0; j < jMax; j++) {
      var index = indexFunction(i, j);
      var value = squares[index];
      if (value !== null) {
        if (value === curComboValue) {
          combo++;
          comboSquares.push(index);
        } else {
          combo = 1;
          comboSquares = [];
          comboSquares.push(index);
          curComboValue = value;
        }
        if (combo === threshold) {
          return {
            'player': curComboValue,
            'squares': comboSquares
          };
        }
      } else {
        // Reset!
        combo = 0;
        curComboValue = "";
        comboSquares = [];
      }
    }
  }
  return null;
}

function checkRows(squares, w, h, threshold) {
  return checkStraightLine(squares, h, w, threshold, (i, j) => (
    (i * h) + j
  ));
}

function checkColumns(squares, w, h, threshold) {
  return checkStraightLine(squares, w, h, threshold, (i, j) => (
    (j * w) + i
  ));
}

function checkDiagonalsDownRight(squares, w, h, threshold) {
  var result = null;
  for (var i = 0; i < h; i++) {
    result = exploreDiagonal(i * w, squares, w, threshold,
    (index) => (
      (index + w + 1)
    ));
    if (result != null) {
      return result;
    }
  }
  for (i = 1; i < w; i++) {
    result = exploreDiagonal(i, squares, w, threshold, (index) => ((index + w + 1)));
    if (result != null) {
      return result;
    }
  }
  return result;
}

function checkDiagonalsUpRight(squares, w, h, threshold) {
  var result = null;
  for (var i = 0; i < h; i++) {
    result = exploreDiagonal(i * w + (w - 1), squares, w, threshold,
      (index) => (
        (index + w - 1)
      )
    );
    if (result != null) {
      return result;
    }
  }
  for (i = 0; i < (w - 1); i++) {
    result = exploreDiagonal(i, squares, w, threshold,
      (index) => (
        (index + w - 1)
      )
    );
    if (result != null) {
      return result;
    }
  }
  return result;
}

function isWithinOneOf(a, b) {
  return a === b || a === (b - 1) || a === (b + 1);
}

function exploreDiagonal(index, squares, w, threshold, indexFunction) {
  // Given a starting index of a diagonal, explores down that path
  var combo, curComboValue, comboSquares;
  var prevIndexMod = index % w;
  while (index < squares.length && isWithinOneOf(prevIndexMod, index % w)) {
    var value = squares[index];
    if (value !== null) {
      if (value === curComboValue) {
        combo++;
        comboSquares.push(index);
      } else {
        combo = 1;
        comboSquares = [];
        comboSquares.push(index);
        curComboValue = value;
      }
      if (combo === threshold) {
        return {
          'player': curComboValue,
          'squares': comboSquares
        };
      }
    } else {
      // Reset!
      combo = 0;
      curComboValue = "";
      comboSquares = [];
    }
    // Update the index
    prevIndexMod = index % w;
    index = indexFunction(index);
  }
  return null;
}

export { checkWin };
