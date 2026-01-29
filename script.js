const gameBoard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;
    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };
    return { getBoard, placeMarker, resetBoard };
})();

const createPlayer = (name, marker) => {
    return { name, marker };
};

const playerX = createPlayer("Player X", "X");
const playerO = createPlayer("Player O", "O");

const gameController = (function () {
    let activePlayer = playerX;
    let gameOver = false;

    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const checkWin = (marker) => {
        const board = gameBoard.getBoard();
        return winCombos.some(combo => combo.every(i => board[i] === marker));
    };

    const checkTie = () => gameBoard.getBoard().every(cell => cell !== "");

    const playRound = (index) => {
        if (gameOver) return "over";
        if (gameBoard.placeMarker(index, activePlayer.marker)) {
            if (checkWin(activePlayer.marker)) {
                gameOver = true;
                return "win";
            }
            if (checkTie()) {
                gameOver = true;
                return "draw";
            }
            activePlayer = activePlayer === playerX ? playerO : playerX;
            return "next";
        }
        return "invalid";
    };

    const resetGame = () => {
        activePlayer = playerX;
        gameOver = false;
        gameBoard.resetBoard();
    };

    return { playRound, getActivePlayer: () => activePlayer, resetGame };
})();

const displayController = (function () {
    const board = document.querySelector("#board");
    const status = document.querySelector("#status");
    const restartBtn = document.querySelector("#restart");

    restartBtn.textContent = "Reset Game";

    const render = (result) => {
        board.innerHTML = "";
        gameBoard.getBoard().forEach((marker, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (marker === "X") cell.classList.add("x-color");
            if (marker === "O") cell.classList.add("o-color");

            cell.textContent = marker;
            cell.addEventListener("click", () => {
                const moveStatus = gameController.playRound(index);
                render(moveStatus);
            });
            board.appendChild(cell);
        });

        if (result === "win") {
            status.textContent = `¡${gameController.getActivePlayer().name}'s win!`;
        } else if (result === "draw") {
            status.textContent = "¡Draw!";
        } else if (result === "over") {
            return;
        } else {
            status.textContent = `${gameController.getActivePlayer().name}'s turn`;
        }
    };

    restartBtn.addEventListener("click", () => {
        gameController.resetGame();
        render();
    });

    render();
})();