// game = {
//   player: 0,
//   board: [
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//   ],
// };

function boardFull(game) {
  return game.board.every((col) => !col.includes(null));
}

function max(arr) {
  if (arr.length === 1) return arr[0];
  return arr.reduce((a, b) => Math.max(a, b));
}
function min(arr) {
  if (arr.length === 1) return arr[0];
  return arr.reduce((a, b) => Math.min(a, b));
}
function availableMoves(game) {
  return game.board
    .map((col, index) => (col.includes(null) ? index : null))
    .filter((e) => e !== null);
}
export function applyMove(game, move) {
  let newBoard = JSON.parse(JSON.stringify(game.board));
  for (let i = 0; i < newBoard[move].length; i++) {
    if (newBoard[move][i] === null) {
      newBoard[move][i] = game.player;
      break;
    }
  }
  return {
    board: newBoard,
    player: 1 - game.player,
  };
}
export function winnerOf(game) {
  // you win -> 1
  // you lose -> -1
  // draw -> 0
  // not finished -> null

  function verticalWin() {
    return game.board
      .map((col) => {
        if (col[3] === null) {
          return false;
        }
        const colParts = [col.slice(0, 4), col.slice(1, 5), col.slice(2, 6)];
        return colParts.some(
          (colP) => colP[0] !== null && colP.every((e) => e === colP[0])
        );
      })
      .some((e) => !!e);
  }

  function horizontalWin() {
    const board = game.board;
    const midCol = board[3].filter((e) => e !== null);
    if (midCol.length < 1) {
      return false;
    }
    return midCol
      .map((_, i) => {
        let rowParts = [];
        for (let j = 0; j < 4; j++) {
          rowParts.push([
            board[j][i],
            board[j + 1][i],
            board[j + 2][i],
            board[j + 3][i],
          ]);
        }
        return rowParts.some(
          (rowP) => rowP[0] !== null && rowP.every((e) => e === rowP[0])
        );
      })
      .some((e) => !!e);
  }

  function diagonalWin() {
    const board = game.board;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const mask = [
          board[i][j],
          board[i + 1][j + 1],
          board[i + 2][j + 2],
          board[i + 3][j + 3],
        ];
        if (mask[0] !== null && mask.every((e) => e === mask[0])) {
          return true;
        }
      }
    }
    return false;
  }

  function antiDiagonalWin() {
    const board = game.board;
    for (let i = 3; i < 7; i++) {
      for (let j = 0; j < 3; j++) {
        const mask = [
          board[i][j],
          board[i - 1][j + 1],
          board[i - 2][j + 2],
          board[i - 3][j + 3],
        ];
        if (mask[0] !== null && mask.every((e) => e === mask[0])) {
          return true;
        }
      }
    }
    return false;
  }

  if (verticalWin() || horizontalWin() || diagonalWin() || antiDiagonalWin()) {
    return game.player === 1 ? 999 : -999;
  } else if (boardFull(game)) {
    return 0;
  }
  return null;
}
function isGameover(game) {
  return winnerOf(game) !== null;
}
function isYourTurn(game) {
  return game.player === 0;
}

export function bestMove(game) {
  const possibleMoves = availableMoves(game)
    .map((move) => applyMove(game, move))
    .map((game) => minimax(game, 0, 4));

  const bestScore = Math.min(...possibleMoves);
  console.log(bestScore); //FORDEV
  const bestMove = availableMoves(game).filter((_, i) => {
    return possibleMoves[i] === bestScore;
  });
  return bestMove;
}

// export function bestMove(game) {
//   const possibleMoves = availableMoves(game)
//     .map((move) => applyMove(game, move))
//     .map((game) => minimax(game, 0, 3));

//   const bestMoves = availableMoves(game).filter((_, i) => {
//     return possibleMoves[i] === -1;
//   });

//   const middleMoves = availableMoves(game).filter((_, i) => {
//     return possibleMoves[i] === 0;
//   });

//   const badMoves = availableMoves(game).filter((_, i) => {
//     return possibleMoves[i] === 1;
//   });

//   if (bestMoves.length > 0) {
//     return bestMoves;
//   } else if (middleMoves.length > 0) {
//     return middleMoves;
//   } else {
//     return badMoves;
//   }
// }

function calculateScoresOfBox() {
  let scores = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];

  function addVerticalScores() {
    for (let i = 0; i < scores.length; i++) {
      for (let j = 0; j < 3; j++) {
        scores[i][j]++;
        scores[i][j + 1]++;
        scores[i][j + 2]++;
        scores[i][j + 3]++;
      }
    }
  }

  function addHorizontalScores() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 6; j++) {
        scores[i][j]++;
        scores[i + 1][j]++;
        scores[i + 2][j]++;
        scores[i + 3][j]++;
      }
    }
  }

  function addDiagonalScores() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        scores[i][j]++;
        scores[i + 1][j + 1]++;
        scores[i + 2][j + 2]++;
        scores[i + 3][j + 3]++;
      }
    }
  }

  function addAntiDiagonalScores() {
    for (let i = 3; i < 7; i++) {
      for (let j = 0; j < 3; j++) {
        scores[i][j]++;
        scores[i - 1][j + 1]++;
        scores[i - 2][j + 2]++;
        scores[i - 3][j + 3]++;
      }
    }
  }

  addVerticalScores();
  addHorizontalScores();
  addDiagonalScores();
  addAntiDiagonalScores();
  return scores;
}

const scoreFactors = calculateScoresOfBox();

function estimateScore(game) {
  const sum = game.board
    .map((col, colIndex) => {
      return col.map(
        (e, i) => (e === 0 ? 1 : e === 1 ? -1 : 0) * scoreFactors[colIndex][i]
      );
    })
    .flat()
    .reduce((a, b) => a + b);
  return sum;
}

// __counter = 0;

function minimax(game, depth, maxDepth) {
  // __counter++;
  if (isGameover(game)) {
    return winnerOf(game);
  } else if (depth >= maxDepth) {
    return estimateScore(game);
  } else {
    const scores = availableMoves(game)
      .map((move) => applyMove(game, move))
      .map((newGame) => minimax(newGame, depth + 1, maxDepth));
    if (isYourTurn(game)) {
      return max(scores);
    } else {
      return min(scores);
    }
  }
}

// function timeit(fn) {
//   console.time("timer");
//   const c0 = __counter;
//   const ret = fn();
//   const c1 = __counter;
//   console.timeEnd("timer");
//   console.log("number of game searched", c1 - c0);
//   return ret;
// }

/*
minimax_ = minimax
minimax = function (...args) {
  try {

    return minimax_(...args)
  } catch (e) {
    console.error("error on this input", JSON.stringify(args, null, 4), e)
    throw e
  }
}
*/

// function trace(fn) {
//   return (...args) => {
//     console.log("CALL", fn.name, "ARGS", JSON.stringify(args))
//     const ret = fn(...args)
//     console.log("CALL", fn.name, "ARGS", JSON.stringify(args), "RETURNS", JSON.stringify(ret))

//     return ret
//   }
// }

// function fmt(p) {
//   return p === null ? " " : (p ? "o" : "x")
// }

// function debugMove(game) {
//   for (const m of availableMoves(game)) {
//     const g2 = applyMove(game, m)
//     const score = minimax(g2)
//     console.log(`
//     ------ score=${score} move=${m}
//     ${fmt(g2.board[0])} ${fmt(g2.board[1])} ${fmt(g2.board[2])}
//     ${fmt(g2.board[3])} ${fmt(g2.board[4])} ${fmt(g2.board[5])}
//     ${fmt(g2.board[6])} ${fmt(g2.board[7])} ${fmt(g2.board[8])}
//     ------
//     `)
//   }
// }

// minimax = trace(minimax)

// const testcases = [
//   // {
//   //   name: "Test empty board",
//   //   input: {
//   //     board: [
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //     ],
//   //     player: 0,
//   //   },
//   //   output: null,
//   // },
//   // {
//   //   name: "Test vertical win 1",
//   //   input: {
//   //     board: [
//   //       [null, null, null, null, null, null],
//   //       [1, null, null, null, null, null],
//   //       [1, 0, 0, 0, 0, null],
//   //       [1, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //     ],
//   //     player: 1,
//   //   },
//   //   output: 1,
//   // },
//   // {
//   //   name: "Test vertical win 2",
//   //   input: {
//   //     board: [
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [0, 1, 0, 0, 0, null],
//   //       [1, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [1, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //     ],
//   //     player: 1,
//   //   },
//   //   output: null,
//   // },
//   // {
//   //   name: "Test horizontal win 1",
//   //   input: {
//   //     board: [
//   //       [1, null, null, null, null, null],
//   //       [0, 1, null, null, null, null],
//   //       [0, 1, null, null, null, null],
//   //       [0, null, null, null, null, null],
//   //       [0, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //     ],
//   //     player: 1,
//   //   },
//   //   output: 1,
//   // },
//   // {
//   //   name: "Test horizontal win 2",
//   //   input: {
//   //     board: [
//   //       [1, null, null, null, null, null],
//   //       [0, null, null, null, null, null],
//   //       [0, null, null, null, null, null],
//   //       [1, null, null, null, null, null],
//   //       [0, null, null, null, null, null],
//   //       [0, null, null, null, null, null],
//   //       [1, null, null, null, null, null],
//   //     ],
//   //     player: 1,
//   //   },
//   //   output: null,
//   // },
//   // {
//   //   name: "Test diagonal win 1",
//   //   input: {
//   //     board: [
//   //       [null, null, null, null, null, null],
//   //       [0, null, null, null, null, null],
//   //       [1, 0, 0, null, null, null],
//   //       [1, 1, 0, null, null, null],
//   //       [0, 1, 1, 0, null, null],
//   //       [null, null, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //     ],
//   //     player: 1,
//   //   },
//   //   output: 1,
//   // },
//   // {
//   //   name: "Test anti-diagonal win 1",
//   //   input: {
//   //     board: [
//   //       [1, null, null, null, null, null],
//   //       [0, null, null, null, null, null],
//   //       [1, 1, 0, 0, null, null],
//   //       [1, 1, 0, null, null, null],
//   //       [1, 0, null, null, null, null],
//   //       [0, 0, null, null, null, null],
//   //       [null, null, null, null, null, null],
//   //     ],
//   //     player: 1,
//   //   },
//   //   output: 1,
//   // },
//   // {
//   //   name: "Test draw game",
//   //   input: {
//   //     board: [
//   //       [0, 0, 0, 1, 1, 1],
//   //       [1, 1, 1, 0, 0, 0],
//   //       [0, 0, 0, 1, 1, 1],
//   //       [1, 1, 1, 0, 0, 0],
//   //       [0, 0, 0, 1, 1, 1],
//   //       [1, 1, 1, 0, 0, 0],
//   //       [0, 0, 0, 1, 1, 1],
//   //     ],
//   //     player: 0,
//   //   },
//   //   output: 0,
//   // },
//   // {
//   //   name: "Test horizontal win 3",
//   //   input: {
//   //     board: [
//   //       [1, 0, 0, null, null, null],
//   //       [0, 0, 0, 1, null, null],
//   //       [0, 1, 0, 1, null, null],
//   //       [0, 1, 0, 1, 1, 1],
//   //       [1, 0, 1, 0, 1, null],
//   //       [0, 1, 1, null, null, null],
//   //       [0, null, null, null, null, null],
//   //     ],
//   //     player: 0,
//   //   },
//   //   output: 1,
//   // },
// ];

// for (const tc of testcases) {
//   if (winnerOf(tc.input) !== tc.output) {
//     throw new Error(
//       tc.name +
//         " failed. Result: " +
//         winnerOf(tc.input) +
//         " Expect: " +
//         tc.output
//     );
//   }
//   console.log(`${tc.name} passed!`);
// }

// game = {player: 0, board: [null, null, null, null, null, null, null, null, null]}
// game = applyMove(game, 4)

// debugMove(game)
