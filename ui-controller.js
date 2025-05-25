/**
 * UI Controller - Handles all DOM manipulation and visual updates
 * This file manages the user interface and visual representation of the maze
 */

import { MAZE_CONFIG, CSS_CLASSES, DOM_IDS, POSITIONS } from "./config.js";

export class UIController {
  constructor() {
    this.initializeElements();
    this.mazeGrid = null;
  }

  /**
   * Initialize all DOM elements
   * Gets references to all important HTML elements
   */ initializeElements() {
    this.mazeContainer = document.getElementById(DOM_IDS.MAZE_CONTAINER);
    this.generateBtn = document.getElementById(DOM_IDS.GENERATE_BTN);
    this.solveBtn = document.getElementById(DOM_IDS.SOLVE_BTN);
    this.clearBtn = document.getElementById(DOM_IDS.CLEAR_BTN);
    this.resetBtn = document.getElementById(DOM_IDS.RESET_BTN);
    this.startRaceBtn = document.getElementById("startRace");
    this.statusText = document.getElementById(DOM_IDS.STATUS_TEXT);

    // Validate that all elements exist
    this.validateElements();
  }

  /**
   * Validate that all required DOM elements exist
   * Throws error if any required element is missing
   */ validateElements() {
    const elements = {
      mazeContainer: this.mazeContainer,
      generateBtn: this.generateBtn,
      solveBtn: this.solveBtn,
      clearBtn: this.clearBtn,
      resetBtn: this.resetBtn,
      startRaceBtn: this.startRaceBtn,
      statusText: this.statusText,
    };

    for (const [name, element] of Object.entries(elements)) {
      if (!element) {
        throw new Error(`Required DOM element not found: ${name}`);
      }
    }
  }

  /**
   * Render the maze visually in the DOM
   * Creates a grid of div elements representing the maze
   * @param {Array} maze - 2D array representing the maze
   */
  renderMaze(maze) {
    // Clear existing maze
    this.mazeContainer.innerHTML = "";

    // Create the grid container
    this.mazeGrid = document.createElement("div");
    this.mazeGrid.className = "maze-grid";
    this.mazeGrid.style.gridTemplateColumns = `repeat(${MAZE_CONFIG.COLS}, 1fr)`;
    this.mazeGrid.style.gridTemplateRows = `repeat(${MAZE_CONFIG.ROWS}, 1fr)`;

    // Create individual cells
    for (let row = 0; row < MAZE_CONFIG.ROWS; row++) {
      for (let col = 0; col < MAZE_CONFIG.COLS; col++) {
        const cell = this.createCell(row, col, maze[row][col]);
        this.mazeGrid.appendChild(cell);
      }
    }

    this.mazeContainer.appendChild(this.mazeGrid);
    console.log("Maze rendered successfully");
  }

  /**
   * Create a single cell element
   * @param {number} row - Row position
   * @param {number} col - Column position
   * @param {number} cellType - Type of cell (wall or path)
   * @returns {HTMLElement} The created cell element
   */
  createCell(row, col, cellType) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = `cell-${row}-${col}`;

    // Add appropriate CSS class based on cell type
    if (cellType === 0) {
      cell.classList.add(CSS_CLASSES.WALL);
    } else {
      cell.classList.add(CSS_CLASSES.PATH);
    }

    // Add special styling for start and end positions
    if (row === POSITIONS.START.row && col === POSITIONS.START.col) {
      cell.classList.add(CSS_CLASSES.START);
    } else if (row === POSITIONS.END.row && col === POSITIONS.END.col) {
      cell.classList.add(CSS_CLASSES.END);
    }

    return cell;
  }

  /**
   * Update the visual state of a specific cell
   * @param {number} row - Row position
   * @param {number} col - Column position
   * @param {string} state - New visual state ('visited', 'current', 'solution', 'user', 'computer')
   */
  async updateCellVisual(row, col, state) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (!cell) {
      console.warn(`Cell not found: ${row}, ${col}`);
      return;
    }

    // Remove previous state classes
    cell.classList.remove(
      CSS_CLASSES.VISITED,
      CSS_CLASSES.CURRENT,
      CSS_CLASSES.SOLUTION,
      CSS_CLASSES.USER,
      CSS_CLASSES.COMPUTER
    );

    // Add new state class
    switch (state) {
      case "visited":
        cell.classList.add(CSS_CLASSES.VISITED);
        break;
      case "current":
        cell.classList.add(CSS_CLASSES.CURRENT);
        break;
      case "solution":
        cell.classList.remove(CSS_CLASSES.VISITED); // Remove visited state first
        cell.classList.add(CSS_CLASSES.SOLUTION);
        break;
      case "user":
        cell.classList.add(CSS_CLASSES.USER);
        break;
      case "computer":
        cell.classList.add(CSS_CLASSES.COMPUTER);
        break;
      default:
        console.warn(`Unknown cell state: ${state}`);
    }
  }

  /**
   * Clear visual state from a specific cell
   * @param {number} row - Row position
   * @param {number} col - Column position
   */
  clearCellVisual(row, col) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
      cell.classList.remove(
        CSS_CLASSES.VISITED,
        CSS_CLASSES.CURRENT,
        CSS_CLASSES.SOLUTION,
        CSS_CLASSES.USER,
        CSS_CLASSES.COMPUTER
      );
    }
  }
  /**
   * Clear all path-related visual states from the maze
   * Removes visited, current, solution, user, and computer classes while keeping walls/paths
   */
  clearPathVisuals() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.remove(
        CSS_CLASSES.VISITED,
        CSS_CLASSES.CURRENT,
        CSS_CLASSES.SOLUTION,
        CSS_CLASSES.USER,
        CSS_CLASSES.COMPUTER
      );
    });
    console.log("Path visuals cleared");
  }

  /**
   * Update the status message displayed to the user
   * @param {string} message - Status message to display
   */
  updateStatus(message) {
    this.statusText.textContent = message;
    console.log("Status updated:", message);
  }

  /**
   * Update button states based on current application state
   * @param {Object} state - Current application state
   */
  updateButtonStates(state) {
    this.generateBtn.disabled = state.solving;
    this.solveBtn.disabled = state.solving || state.solved;
    this.clearBtn.disabled = state.solving || !state.solved;
    this.resetBtn.disabled = state.solving;

    // Add visual feedback for button states
    this.updateButtonAppearance();
  }

  /**
   * Update visual appearance of buttons based on their state
   */ updateButtonAppearance() {
    const buttons = [
      this.generateBtn,
      this.solveBtn,
      this.clearBtn,
      this.resetBtn,
      this.startRaceBtn,
    ];

    buttons.forEach((button) => {
      if (button.disabled) {
        button.style.opacity = "0.6";
        button.style.cursor = "not-allowed";
      } else {
        button.style.opacity = "1";
        button.style.cursor = "pointer";
      }
    });
  }
  /**
   * Setup event listeners for all buttons
   * @param {Object} callbacks - Object containing callback functions for each button
   */
  setupEventListeners(callbacks) {
    this.generateBtn.addEventListener("click", callbacks.onGenerate);
    this.solveBtn.addEventListener("click", callbacks.onSolve);
    this.clearBtn.addEventListener("click", callbacks.onClear);
    this.resetBtn.addEventListener("click", callbacks.onReset);
    if (callbacks.onStartRace) {
      this.startRaceBtn.addEventListener("click", callbacks.onStartRace);
    }

    console.log("Event listeners setup complete");
  }

  /**
   * Show loading animation while solving
   */
  showLoadingState() {
    this.statusText.innerHTML =
      'Solving maze using DFS algorithm... <span class="loading">⏳</span>';
  }

  /**
   * Get the current maze grid element
   * @returns {HTMLElement} The maze grid element
   */
  getMazeGrid() {
    return this.mazeGrid;
  }

  /**
   * Highlight a specific cell temporarily (for debugging)
   * @param {number} row - Row position
   * @param {number} col - Column position
   * @param {string} color - Color to highlight with
   * @param {number} duration - Duration in milliseconds
   */
  async highlightCell(row, col, color = "yellow", duration = 500) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
      const originalBackground = cell.style.backgroundColor;
      cell.style.backgroundColor = color;

      setTimeout(() => {
        cell.style.backgroundColor = originalBackground;
      }, duration);
    }
  }

  /**
   * Show win animation for the winner
   * @param {string} winner - "user" or "computer"
   */
  showWinAnimation(winner) {
    const cells = document.querySelectorAll(`.${winner}`);
    cells.forEach((cell) => {
      cell.classList.add("winner-animation");
    });

    // Flash the maze border
    this.mazeGrid.classList.add("game-over");

    setTimeout(() => {
      cells.forEach((cell) => {
        cell.classList.remove("winner-animation");
      });
      this.mazeGrid.classList.remove("game-over");
    }, 3000);
  }
}
