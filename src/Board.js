import Column from "./Column";
import { useEffect, useState } from "react";
import { applyMove, winnerOf, bestMove } from "./connect4-ai";

export default function Board() {
  const [game, setGame] = useState({
    player: 0,
    board: [
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ],
  });

  useEffect(() => {
    if (game.player === 1 && winnerOf(game) === null) {
      aiMove();
    }
  }, [game]);

  function aiMove() {
    const bestMoves = bestMove(game);
    const randomMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    setGame(applyMove(game, randomMove));
    // setGame(applyMove(game, bestMove(game)))
  }

  function handleClick(col) {
    if (
      game.player === 1 ||
      !game.board[col].includes(null) ||
      winnerOf(game) !== null
    ) {
      return;
    }
    setGame(applyMove(game, col));
  }

  function handleNewGame() {
    setGame({
      player: 0,
      board: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
      ],
    });
  }

  const winnerMessage =
    winnerOf(game) === 999
      ? "You win!"
      : winnerOf(game) === -999
      ? "You lose!"
      : winnerOf(game) === 0
      ? "Draw game"
      : "";

  return (
    <>
      <div className="board">
        {game.board.map((col, index) => (
          <Column
            key={index}
            col={[...col].reverse()}
            handleClick={() => handleClick(index)}
          />
        ))}
      </div>
      <button onClick={() => handleNewGame()} style={{ marginTop: 20 }}>
        New Game
      </button>
      <div style={{ marginTop: 10 }}>{winnerMessage}</div>
    </>
  );
}
