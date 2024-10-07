import React, { useState } from 'react';
import './Game.css'

function Square({ value, onClick, highlight }) {
    return (
        <button
            className={`square ${highlight ? 'highlight' : ''}`}
            onClick={onClick}
        >
            {value}
        </button>
    );
}

function Board({ squares, onClick, winningSquares }) {
    const renderSquare = (i) => {
        return (
            <Square
                key={i}
                value={squares[i]}
                onClick={() => onClick(i)}
                highlight={winningSquares.includes(i)}
            />
        );
    };

    const board = [];
    for (let row = 0; row < 3; row++) {
        let cols = [];
        for (let col = 0; col < 3; col++) {
            cols.push(renderSquare(row * 3 + col));
        }
        board.push(<div key={row} className="board-row">{cols}</div>);
    }

    return <div>{board}</div>;
}

function Game() {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [ascendingOrder, setAscendingOrder] = useState(true);

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const handleClick = (i) => {
        const currentHistory = history.slice(0, stepNumber + 1);
        const currentSquares = current.squares.slice();
        if (winner || currentSquares[i]) return;

        currentSquares[i] = xIsNext ? 'X' : 'O';
        setHistory(currentHistory.concat([
            { squares: currentSquares, location: getLocation(i) }
        ]));
        setStepNumber(currentHistory.length);
        setXIsNext(!xIsNext);
    };

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
    };

    const toggleSortOrder = () => {
        setAscendingOrder(!ascendingOrder);
    };

    const moves = history.map((step, move) => {
        const desc = move ? `Go to move #${move} (${step.location.row}, ${step.location.col})` : 'Go to game start';
        return (
            <li key={move}>
                {move === stepNumber ? (
                    <span>You are at move #{move}</span>
                ) : (
                    <button onClick={() => jumpTo(move)}>{desc}</button>
                )}
            </li>
        );
    });

    const sortedMoves = ascendingOrder ? moves : moves.reverse();

    let status;
    if (winner) {
        status = `Winner: ${winner.player}`;
    } else if (history.length === 10) {
        status = 'Draw!';
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }

    return (
        <div className="game-container">
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={handleClick}
                        winningSquares={winner ? winner.line : []}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={toggleSortOrder}>
                        {ascendingOrder ? 'Sort Descending' : 'Sort Ascending'}
                    </button>
                    <ol>{sortedMoves}</ol>
                </div>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { player: squares[a], line: [a, b, c] };
        }
    }
    return null;
}

function getLocation(i) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return { row, col };
}

export default Game;
