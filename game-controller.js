/**
 * Game Controller for User vs Computer Maze Race
 * Handles user movement, computer (AI) movement, and win conditions
 */
import {
  POSITIONS,
  CELL_TYPES,
  DIRECTIONS,
  KEYS,
  GAME_CONFIG,
} from "./config.js";
import { MazeGenerator } from "./maze-generator.js";

export class GameController {
  constructor(maze, uiController, dfsSolver) {
    this.maze = maze;
    this.ui = uiController;
    this.dfsSolver = dfsSolver;
    this.userPos = { ...POSITIONS.START };
    this.computerPath = [];
    this.computerIndex = 0;
    this.computerActive = false;
    this.gameActive = false;
    this.finished = false;
    this.winner = null;

    this.setupKeyboardControls();
  }

  /**
   * Start a new race between user and computer
   */
  async startRace() {
    this.gameActive = true;
    this.finished = false;
    this.winner = null;
    this.userPos = { ...POSITIONS.START };

    // Render the maze first
    this.ui.renderMaze(this.maze);

    // Clear any existing path visuals
    this.ui.clearPathVisuals();

    // Set user position
    this.ui.updateCellVisual(this.userPos.row, this.userPos.col, "user");

    // Get computer path using DFS
    console.log("Getting computer path...");
    this.computerPath = await this.getComputerPath();
    console.log("Computer path length:", this.computerPath.length);

    this.computerIndex = 0;
    this.computerActive = true;

    // Start computer movement
    this.moveComputer();

    this.ui.updateStatus(
      "Race started! Use WASD or arrow keys to move. First to the end wins!"
    );
  }

  /**
   * Get the optimal path for the computer using DFS
   */
  async getComputerPath() {
    // Use the DFS solver to find the path from start to end
    const result = await this.dfsSolver.solveMaze();
    if (result && result.path && result.path.length > 0) {
      return result.path;
    }
    return [];
  }

  /**
   * Set up keyboard event listeners for user movement
   */
  setupKeyboardControls() {
    document.addEventListener("keydown", (event) => {
      if (!this.gameActive || this.finished) {
        if (KEYS.RESTART.includes(event.code) && this.finished) {
          this.restartGame();
        }
        return;
      }

      let newRow = this.userPos.row;
      let newCol = this.userPos.col;

      // Check which key was pressed
      if (KEYS.UP.includes(event.code)) {
        newRow--;
        event.preventDefault();
      } else if (KEYS.DOWN.includes(event.code)) {
        newRow++;
        event.preventDefault();
      } else if (KEYS.LEFT.includes(event.code)) {
        newCol--;
        event.preventDefault();
      } else if (KEYS.RIGHT.includes(event.code)) {
        newCol++;
        event.preventDefault();
      } else {
        return; // Key not recognized
      }

      // Try to move user
      this.moveUser(newRow, newCol);
    });
  }

  /**
   * Move the user to a new position if valid
   */
  moveUser(newRow, newCol) {
    if (!this.isValidMove(newRow, newCol)) {
      return false;
    }

    // Clear previous user position
    this.ui.clearCellVisual(this.userPos.row, this.userPos.col);

    // Update user position
    this.userPos.row = newRow;
    this.userPos.col = newCol;

    // Show new user position
    this.ui.updateCellVisual(newRow, newCol, "user");

    // Check if user reached the end
    if (newRow === POSITIONS.END.row && newCol === POSITIONS.END.col) {
      this.endGame("user");
    }

    return true;
  }

  /**
   * Move the computer along its predetermined path
   */
  moveComputer() {
    if (
      !this.computerActive ||
      this.finished ||
      this.computerIndex >= this.computerPath.length
    ) {
      return;
    }

    const currentPos = this.computerPath[this.computerIndex];

    // Clear previous computer position if not the first move
    if (this.computerIndex > 0) {
      const prevPos = this.computerPath[this.computerIndex - 1];
      this.ui.clearCellVisual(prevPos.row, prevPos.col);
    }

    // Show computer at new position
    this.ui.updateCellVisual(currentPos.row, currentPos.col, "computer");

    // Check if computer reached the end
    if (
      currentPos.row === POSITIONS.END.row &&
      currentPos.col === POSITIONS.END.col
    ) {
      this.endGame("computer");
      return;
    }

    this.computerIndex++;

    // Schedule next computer move
    setTimeout(() => {
      this.moveComputer();
    }, GAME_CONFIG.COMPUTER_MOVE_DELAY);
  }

  /**
   * Check if a move to the given position is valid
   */
  isValidMove(row, col) {
    // Check bounds
    if (
      row < 0 ||
      row >= this.maze.length ||
      col < 0 ||
      col >= this.maze[0].length
    ) {
      return false;
    }

    // Check if it's a wall
    if (this.maze[row][col] === CELL_TYPES.WALL) {
      return false;
    }

    return true;
  }

  /**
   * End the game with a winner
   */
  endGame(winner) {
    this.finished = true;
    this.gameActive = false;
    this.computerActive = false;
    this.winner = winner;

    if (winner === "user") {
      this.ui.updateStatus(
        "🎉 YOU WIN! Congratulations! Press R to restart or click 'New Game'"
      );
      this.ui.showWinAnimation("user");
    } else {
      this.ui.updateStatus(
        "💻 Computer wins! Better luck next time! Press R to restart or click 'New Game'"
      );
      this.ui.showWinAnimation("computer");
    }
  }

  /**
   * Restart the current game
   */
  restartGame() {
    this.startRace();
  }

  /**
   * Generate a new maze and start a fresh game
   */
  async newGame() {
    const mazeGenerator = new MazeGenerator();
    this.maze = mazeGenerator.generateMaze();

    // Update the DFS solver with the new maze
    this.dfsSolver.setMaze(this.maze);

    await this.startRace();
  }

  /**
   * Stop the current game
   */
  stopGame() {
    this.gameActive = false;
    this.computerActive = false;
    this.finished = true;
  }
}
