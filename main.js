// We wrap the entire game logic in a DOMContentLoaded event listener.
// This ensures that the JavaScript code only runs after all the HTML elements
// on the page have been fully loaded, preventing timing-related errors.
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Constants ---
    // Grabbing the main elements from the HTML to interact with them.
    const boardElement = document.getElementById('board');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const cells = document.querySelectorAll('.cell');

    // --- Game State Variables ---
    // These variables will track the state of the game as it's played.
    let currentPlayer = 'X'; // 'X' always starts
    let gameState = ['', '', '', '', '', '', '', '', '']; // Represents the 9 cells of the board
    let isGameActive = true; // This will be set to false when the game is over

    // --- Winning Conditions ---
    // An array of all possible winning combinations of cell indices.
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    /**
     * Handles the logic when a cell is clicked. This is the primary function for a player's move.
     * @param {MouseEvent} clickedCellEvent - The event object from the click.
     */
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // If the cell is already filled or the game is over, ignore the click.
        if (gameState[clickedCellIndex] !== '' || !isGameActive) {
            return;
        }

        // Process the move
        updateGameState(clickedCell, clickedCellIndex);
        validateResult();
    }

    /**
     * Updates the internal game state and the UI for the played cell.
     * @param {HTMLElement} clickedCell - The button element that was clicked. * @param {number} clickedCellIndex - The index of the cell (0-8).
     */
    function updateGameState(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        // Add the specific class ('x' or 'o') to trigger the CSS neon glow effect.
        clickedCell.classList.add(currentPlayer.toLowerCase());
    }

    /**
     * Checks if the game has been won, drawn, or should continue.
     */
    function validateResult() {
        let roundWon = false;
        let winningCombination = [];

        for (let i = 0; i < winningConditions.length; i++) {
            const condition = winningConditions[i];
            const cellA = gameState[condition[0]];
            const cellB = gameState[condition[1]];
            const cellC = gameState[condition[2]];

            if (cellA === '' || cellB === '' || cellC === '') {
                continue; // This combination is not a win yet
            }
            if (cellA === cellB && cellB === cellC) {
                roundWon = true;
                winningCombination = condition;
                break; // Found a winner
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
            isGameActive = false;
            // Trigger the winning animation from the CSS
            highlightWinningCells(winningCombination);
            return;
        }

        // Check for a draw (if all cells are filled and no one won)
        const isDraw = !gameState.includes("");
        if (isDraw) {
            statusDisplay.innerHTML = `Game ended in a draw!`;
            isGameActive = false;
            return;
        }

        // If the game is still ongoing, switch players.
        switchPlayer();
    }

    /**
     * Switches the current player and updates the status display.
     */
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;
    }

    /**
     * Adds the 'winning-cell' class to the winning cells to trigger the CSS animation.
     * @param {number[]} combination - The array of 3 indices for the winning cells.
     */
    function highlightWinningCells(combination) {
        combination.forEach(index => {
            const cell = boardElement.querySelector(`[data-index='${index}']`);
            cell.classList.add('winning-cell');
        });
    }

    /**
     * Resets the game to its initial state for a new round.
     */
    function handleRestartGame() {
        const confirmRestart = confirm("Are you sure you want to restart the game?");
        if (!confirmRestart) {
            return;
        }

        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;

        // Clear all cells on the board visually
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
    }

    // --- Initialize Game ---
    // Add event listeners to all the cells and the restart button.
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', handleRestartGame);

});