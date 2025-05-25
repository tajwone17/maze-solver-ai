/**
 * Depth-First Search (DFS) Algorithm Implementation
 * This file contains the pathfinding logic using DFS with backtracking
 */

import {
  MAZE_CONFIG,
  CELL_TYPES,
  DIRECTIONS,
  POSITIONS,
  ANIMATION,
} from "./config.js";

export class DFSSolver {
  constructor(maze, uiController) {
    this.maze = maze;
    this.ui = uiController;
    this.rows = MAZE_CONFIG.ROWS;
    this.cols = MAZE_CONFIG.COLS;
    this.start = POSITIONS.START;
    this.end = POSITIONS.END;
  }

  /**
   * Solve the maze using Depth-First Search algorithm
   * @returns {Object} Result object containing success status and path
   */
  async solveMaze() {
    // Initialize tracking structures
    const visited = new Set(); // Track visited cells to avoid cycles
    const path = []; // Track current path for backtracking

    console.log("Starting DFS from:", this.start, "to:", this.end);

    // Start the recursive DFS search
    const found = await this.dfs(this.start.row, this.start.col, visited, path);

    return {
      success: found,
      path: found ? path : [],
      visitedCount: visited.size,
    };
  }

  /**
   * Recursive Depth-First Search implementation
   * @param {number} row - Current row position
   * @param {number} col - Current column position
   * @param {Set} visited - Set of visited cell coordinates
   * @param {Array} path - Current path from start to current position
   * @returns {boolean} True if path to end is found
   */
  async dfs(row, col, visited, path) {
    // Base Case 1: Check if we've reached the destination
    if (this.isEndCell(row, col)) {
      path.push({ row, col });
      console.log("Found destination at:", row, col);
      return true;
    }

    // Base Case 2: Check if current position is invalid
    if (!this.isValidPosition(row, col, visited)) {
      return false;
    }

    // Mark current cell as visited
    const cellKey = `${row},${col}`;
    visited.add(cellKey);
    path.push({ row, col });

    console.log(`Visiting cell (${row}, ${col}) - Path length: ${path.length}`);

    // Visual update: Show current exploration (with animation)
    await this.ui.updateCellVisual(row, col, "current");
    await this.sleep(ANIMATION.DFS_STEP_DELAY);

    // Mark as visited visually (except for start and end cells)
    if (!this.isStartCell(row, col) && !this.isEndCell(row, col)) {
      await this.ui.updateCellVisual(row, col, "visited");
    }

    // Explore all four directions
    for (const [deltaRow, deltaCol] of DIRECTIONS.PATHFINDING) {
      const newRow = row + deltaRow;
      const newCol = col + deltaCol;

      // Recursively search in this direction
      if (await this.dfs(newRow, newCol, visited, path)) {
        return true; // Solution found in this direction
      }
    }

    // No solution found in any direction - backtrack
    console.log(`Backtracking from (${row}, ${col})`);
    path.pop(); // Remove current cell from path
    return false;
  }

  /**
   * Check if current position is valid for exploration
   * @param {number} row - Row position
   * @param {number} col - Column position
   * @param {Set} visited - Set of visited cells
   * @returns {boolean} True if position is valid for exploration
   */
  isValidPosition(row, col, visited) {
    const cellKey = `${row},${col}`;

    return (
      this.isInBounds(row, col) && // Within maze boundaries
      this.maze[row][col] === CELL_TYPES.PATH && // Is a walkable path
      !visited.has(cellKey) // Not already visited
    );
  }

  /**
   * Check if position is within maze boundaries
   * @param {number} row - Row position
   * @param {number} col - Column position
   * @returns {boolean} True if within bounds
   */
  isInBounds(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  /**
   * Check if current position is the start cell
   * @param {number} row - Row position
   * @param {number} col - Column position
   * @returns {boolean} True if this is the start cell
   */
  isStartCell(row, col) {
    return row === this.start.row && col === this.start.col;
  }

  /**
   * Check if current position is the end cell
   * @param {number} row - Row position
   * @param {number} col - Column position
   * @returns {boolean} True if this is the end cell
   */
  isEndCell(row, col) {
    return row === this.end.row && col === this.end.col;
  }

  /**
   * Highlight the solution path with animation
   * @param {Array} path - Array of cell positions forming the solution path
   */
  async highlightSolutionPath(path) {
    console.log("Highlighting solution path with", path.length, "steps");

    for (let i = 0; i < path.length; i++) {
      const { row, col } = path[i];

      // Skip highlighting start and end cells (they have their own styling)
      if (this.isStartCell(row, col) || this.isEndCell(row, col)) {
        continue;
      }

      // Highlight this cell as part of the solution
      await this.ui.updateCellVisual(row, col, "solution");
      await this.sleep(ANIMATION.SOLUTION_HIGHLIGHT);
    }
  }

  /**
   * Utility function to create delays for animations
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Promise that resolves after the delay
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get statistics about the current search
   * @param {Array} path - The found path
   * @param {number} visitedCount - Number of cells visited during search
   * @returns {Object} Statistics object
   */
  getSearchStatistics(path, visitedCount) {
    return {
      pathLength: path.length,
      cellsVisited: visitedCount,
      efficiency:
        path.length > 0 ? ((path.length / visitedCount) * 100).toFixed(1) : 0,
    };
  }
}
