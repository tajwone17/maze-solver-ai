/**
 * Configuration file containing all constants and settings for the maze solver
 * This file contains all the configurable parameters in one place
 */

// Maze dimensions - should be odd numbers for proper maze generation
export const MAZE_CONFIG = {
  ROWS: 21, // Number of rows in the maze
  COLS: 31, // Number of columns in the maze
  CELL_SIZE: 25, // Size of each cell in pixels
};

// Starting and ending positions
export const POSITIONS = {
  START: { row: 1, col: 1 }, // Green cell
  END: { row: MAZE_CONFIG.ROWS - 2, col: MAZE_CONFIG.COLS - 2 }, // Red cell
};

// Cell types used in the maze array
export const CELL_TYPES = {
  WALL: 0, // Impassable wall
  PATH: 1, // Walkable path
};

// CSS class names for different cell states
export const CSS_CLASSES = {
  WALL: "wall",
  PATH: "path",
  START: "start",
  END: "end",
  VISITED: "visited",
  CURRENT: "current",
  SOLUTION: "solution",
};

// Animation timing settings
export const ANIMATION = {
  DFS_STEP_DELAY: 50, // Delay between DFS steps (ms)
  SOLUTION_HIGHLIGHT: 100, // Delay when highlighting solution path (ms)
};

// Movement directions for pathfinding
export const DIRECTIONS = {
  // For maze generation (move 2 cells to ensure walls between paths)
  GENERATION: [
    [-2, 0], // Up
    [2, 0], // Down
    [0, -2], // Left
    [0, 2], // Right
  ],

  // For pathfinding (move 1 cell in each direction)
  PATHFINDING: [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
  ],
};

// DOM element IDs
export const DOM_IDS = {
  MAZE_CONTAINER: "mazeContainer",
  GENERATE_BTN: "generateMaze",
  SOLVE_BTN: "solveMaze",
  CLEAR_BTN: "clearPath",
  RESET_BTN: "resetMaze",
  STATUS_TEXT: "statusText",
};

// Status messages
export const MESSAGES = {
  MAZE_GENERATED: "Maze generated! Click 'Solve Maze' to find the path.",
  SOLVING: "Solving maze using DFS algorithm...",
  SOLVED: (steps) => `Maze solved! Path found with ${steps} steps.`,
  NO_SOLUTION: "No solution found! The maze might be unsolvable.",
  PATH_CLEARED: "Path cleared. Click 'Solve Maze' to find the path again.",
  INITIAL: "Click 'Generate New Maze' to start!",
};
