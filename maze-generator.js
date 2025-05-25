/**
 * Maze Generator using Recursive Backtracking Algorithm
 * This file handles all maze generation logic
 */

import { MAZE_CONFIG, CELL_TYPES, DIRECTIONS } from "./config.js";

export class MazeGenerator {
  constructor() {
    this.maze = [];
    this.rows = MAZE_CONFIG.ROWS;
    this.cols = MAZE_CONFIG.COLS;
  }

  /**
   * Initialize the maze with all walls
   * Creates a 2D array filled with walls (0)
   */
  initializeMaze() {
    this.maze = [];
    for (let i = 0; i < this.rows; i++) {
      this.maze[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.maze[i][j] = CELL_TYPES.WALL; // Start with all walls
      }
    }
  }

  /**
   * Generate a new maze using recursive backtracking algorithm
   * This creates a perfect maze (no loops, single path between any two points)
   * @returns {Array} The generated maze as a 2D array
   */
  generateMaze() {
    // Step 1: Initialize maze with all walls
    this.initializeMaze();

    // Step 2: Start the recursive backtracking algorithm
    const stack = [];
    const startCell = { row: 1, col: 1 }; // Start from an odd position

    // Make the starting cell a path
    this.maze[startCell.row][startCell.col] = CELL_TYPES.PATH;
    stack.push(startCell);

    // Step 3: Continue until we've visited all possible cells
    while (stack.length > 0) {
      const currentCell = stack[stack.length - 1]; // Peek at top of stack
      const unvisitedNeighbors = this.getUnvisitedNeighbors(
        currentCell.row,
        currentCell.col
      );

      if (unvisitedNeighbors.length > 0) {
        // Choose a random unvisited neighbor
        const randomNeighbor =
          unvisitedNeighbors[
            Math.floor(Math.random() * unvisitedNeighbors.length)
          ];

        // Remove the wall between current cell and chosen neighbor
        this.carvePassage(currentCell, randomNeighbor);

        // Move to the neighbor
        stack.push(randomNeighbor);
      } else {
        // No unvisited neighbors, backtrack
        stack.pop();
      }
    }

    return this.maze;
  }

  /**
   * Get all unvisited neighboring cells for maze generation
   * @param {number} row - Current row position
   * @param {number} col - Current column position
   * @returns {Array} Array of unvisited neighbor positions
   */
  getUnvisitedNeighbors(row, col) {
    const neighbors = [];

    // Check all four directions (moving 2 cells to ensure walls between paths)
    for (const [deltaRow, deltaCol] of DIRECTIONS.GENERATION) {
      const newRow = row + deltaRow;
      const newCol = col + deltaCol;

      // Check if the neighbor is within bounds and unvisited (still a wall)
      if (
        this.isValidCell(newRow, newCol) &&
        this.maze[newRow][newCol] === CELL_TYPES.WALL
      ) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  }

  /**
   * Carve a passage between two cells by removing the wall between them
   * @param {Object} currentCell - Current cell position {row, col}
   * @param {Object} neighborCell - Neighbor cell position {row, col}
   */
  carvePassage(currentCell, neighborCell) {
    // Calculate the wall position (halfway between current and neighbor)
    const wallRow = currentCell.row + (neighborCell.row - currentCell.row) / 2;
    const wallCol = currentCell.col + (neighborCell.col - currentCell.col) / 2;

    // Remove the wall and make both cells paths
    this.maze[wallRow][wallCol] = CELL_TYPES.PATH;
    this.maze[neighborCell.row][neighborCell.col] = CELL_TYPES.PATH;
  }

  /**
   * Check if a cell position is valid (within maze boundaries and not on the border)
   * @param {number} row - Row position to check
   * @param {number} col - Column position to check
   * @returns {boolean} True if the cell position is valid
   */
  isValidCell(row, col) {
    return (
      row > 0 && // Not on top border
      row < this.rows - 1 && // Not on bottom border
      col > 0 && // Not on left border
      col < this.cols - 1 // Not on right border
    );
  }

  /**
   * Get the current maze
   * @returns {Array} The maze as a 2D array
   */
  getMaze() {
    return this.maze;
  }

  /**
   * Print the maze to console for debugging
   * Useful for understanding the maze structure
   */
  printMaze() {
    console.log("Generated Maze:");
    for (let i = 0; i < this.rows; i++) {
      let row = "";
      for (let j = 0; j < this.cols; j++) {
        row += this.maze[i][j] === CELL_TYPES.WALL ? "█" : " ";
      }
      console.log(row);
    }
  }
}
