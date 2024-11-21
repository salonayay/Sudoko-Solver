// Initialize grid cell references
var arr = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
  for (var j = 0; j < 9; j++) {
    arr[i][j] = document.getElementById(i * 9 + j);
  }
}

// Initialize board array
var board = [[], [], [], [], [], [], [], [], []];

// Fill board function
function FillBoard(board) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] != 0) {
        arr[i][j].innerText = board[i][j];
      } else {
        arr[i][j].innerText = "";
      }
    }
  }
}

// Event listeners for buttons
let GetPuzzle = document.getElementById("GetPuzzle");
let SolvePuzzle = document.getElementById("SolvePuzzle");

// Fetch Sudoku puzzle from API
GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest()
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response)
		console.log(response)
		board = response.board
		FillBoard(board)
	}
	xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy')
	//we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
	xhrRequest.send()
}

SolvePuzzle.onclick = () => {
	sudukosolver(board, 0, 0, 9);
};
// Sudoku solver function
function sudokosolver(board, i, j, n) {
  // Base case: solved
  if (i == n) {
    FillBoard(board);
    return true;
  }

  // Move to next row
  if (j == n) {
    return sudokosolver(board, i + 1, 0, n);
  }

  // Skip pre-filled cells
  if (board[i][j] != 0) {
    return sudokosolver(board, i, j + 1, n);
  }

  // Try placing numbers 1-9
  for (let num = 1; num <= 9; num++) {
    if (isvalid(board, i, j, num, n)) {
      board[i][j] = num;
      if (sudokosolver(board, i, j + 1, n)) {
        return true;
      }
      board[i][j] = 0; // Backtrack
    }
  }

  return false; // No solution
}

// Check if placement is valid
function isvalid(board, i, j, num, n) {
  // Row and column check
  for (let x = 0; x < n; x++) {
    if (board[i][x] == num || board[x][j] == num) {
      return false;
    }
  }

  // Subgrid check
  let root = Math.sqrt(n);
  let si = i - (i % root);
  let sj = j - (j % root);
  for (let x = si; x < si + root; x++) {
    for (let y = sj; y < sj + root; y++) {
      if (board[x][y] == num) {
        return false;
      }
    }
  }

  return true;
}
