/**
 * SUPER SIMPLE MAZE SOLVER
 * A very beginner-friendly maze generation and solving script
 * No complex patterns, everything is kept simple and well-explained
 */

// ======== SIMPLE SETTINGS ========
// These settings control how the maze works

// Maze size (how many rows and columns)
const MAZE_ROWS = 15;
const MAZE_COLS = 21;

// Cell types (what each number means in our maze)
const WALL = 0; // 0 = wall (can't walk through)
const PATH = 1; // 1 = path (can walk through)

// Starting and ending positions
const START_ROW = 1;
const START_COL = 1;
const END_ROW = MAZE_ROWS - 2;
const END_COL = MAZE_COLS - 2;

// Animation speed (milliseconds between steps)
const SOLVING_SPEED = 100; // How fast to animate solving
const SOLUTION_SPEED = 200; // How fast to show the solution path

// Computer movement speed during race (milliseconds between steps, medium difficulty)
const COMPUTER_MOVE_SPEED = 300;

// Keyboard keys for movement
const UP_KEYS = ["ArrowUp", "KeyW", "w", "W"];
const DOWN_KEYS = ["ArrowDown", "KeyS", "s", "S"];
const LEFT_KEYS = ["ArrowLeft", "KeyA", "a", "A"];
const RIGHT_KEYS = ["ArrowRight", "KeyD", "d", "D"];
const RESTART_KEYS = ["KeyR", "r", "R"];

// ======== GLOBAL VARIABLES ========
// Variables we'll use throughout the program

// The maze itself (will be a 2D array of 0s and 1s)
let maze = [];

// Various state tracking variables
let isSolving = false; // Are we currently solving?
let isSolved = false; // Has the maze been solved?
let doesMazeExist = false; // Has a maze been generated?
let solutionPath = []; // Path from start to end

// Race mode variables
let raceActive = false; // Is race mode currently active?
let userPosition = { row: 1, col: 1 }; // User's current position
let computerPosition = { row: 1, col: 1 }; // Computer's current position
let computerPath = []; // Path the computer will follow
let computerMoveInterval = null; // Timer for computer movement
let winner = null; // Who won the race (null, "user", or "computer")

// Score tracking
let playerWins = 0; // How many times the user has won
let computerWins = 0; // How many times the computer has won

// ======== DOM ELEMENTS ========
// Getting references to HTML elements

// Buttons
let generateButton;
let solveButton;
let clearButton;
let resetButton;
let startRaceButton;

// Display areas
let mazeContainer;
let statusMessage;
let playerScoreElement;
let computerScoreElement;

// ======== INITIALIZATION ========
// This runs when the page loads

// Wait for the page to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded, initializing maze solver..."); // Get all the buttons
  generateButton = document.getElementById("generateMazeButton");
  solveButton = document.getElementById("solveMazeButton");
  clearButton = document.getElementById("clearPathButton");
  resetButton = document.getElementById("resetButton");
  startRaceButton = document.getElementById("startRaceButton");
  // Difficulty buttons have been removed
  // Get the container and status message
  mazeContainer = document.getElementById("mazeContainer");
  statusMessage = document.getElementById("statusMessage");

  // Get scoreboard elements
  playerScoreElement = document.getElementById("playerScore");
  computerScoreElement = document.getElementById("computerScore");

  // Set up button click handlers
  generateButton.addEventListener("click", generateNewMaze);
  solveButton.addEventListener("click", solveMaze);
  clearButton.addEventListener("click", clearPath);
  resetButton.addEventListener("click", generateNewMaze);
  startRaceButton.addEventListener("click", startRace);
  // Difficulty button handlers have been removed

  // Set up keyboard controls for the race
  document.addEventListener("keydown", handleKeyPress);

  // Generate the first maze
  generateNewMaze();

  console.log("Maze solver initialized!");
});

// ======== MAZE GENERATION ========
// Functions for creating the maze

/**
 * Generate a new maze
 * This is the main function to create a new maze
 */
function generateNewMaze() {
  console.log("Generating new maze...");

  // Reset everything
  isSolving = false;
  isSolved = false;
  doesMazeExist = false;
  solutionPath = [];

  // Create the maze
  initializeEmptyMaze();
  carvePathsThroughMaze();

  // Make sure start and end are open paths
  maze[START_ROW][START_COL] = PATH;
  maze[END_ROW][END_COL] = PATH;

  // Show the maze on screen
  displayMaze();

  // Update status
  doesMazeExist = true;
  updateStatus("Maze generated! Click 'Solve Maze' to find the path.");
  updateButtonStates();

  console.log("New maze generated successfully");
}

/**
 * Create an empty maze filled with walls
 */
function initializeEmptyMaze() {
  maze = [];

  // Create a grid filled with walls (0)
  for (let row = 0; row < MAZE_ROWS; row++) {
    maze[row] = [];
    for (let col = 0; col < MAZE_COLS; col++) {
      maze[row][col] = WALL;
    }
  }
}

/**
 * Carve paths through the maze using recursive backtracking
 */
function carvePathsThroughMaze() {
  // Stack for backtracking
  const stack = [];

  // Start at position (1,1)
  let startCell = { row: 1, col: 1 };

  // Mark the starting cell as a path
  maze[startCell.row][startCell.col] = PATH;
  stack.push(startCell);

  // Continue until we've visited all cells
  while (stack.length > 0) {
    // Get the current cell from the top of the stack
    const currentCell = stack[stack.length - 1];

    // Find all unvisited neighbors (2 cells away)
    const neighbors = getUnvisitedNeighbors(currentCell.row, currentCell.col);

    if (neighbors.length > 0) {
      // Choose a random neighbor
      const randomIndex = Math.floor(Math.random() * neighbors.length);
      const nextCell = neighbors[randomIndex];

      // Remove the wall between current cell and chosen neighbor
      const wallRow = currentCell.row + (nextCell.row - currentCell.row) / 2;
      const wallCol = currentCell.col + (nextCell.col - currentCell.col) / 2;
      maze[wallRow][wallCol] = PATH;

      // Make the neighbor a path and add to stack
      maze[nextCell.row][nextCell.col] = PATH;
      stack.push(nextCell);
    } else {
      // No unvisited neighbors, backtrack
      stack.pop();
    }
  }
}

/**
 * Find all unvisited neighbors of a cell
 * These are cells 2 steps away (with wall between)
 */
function getUnvisitedNeighbors(row, col) {
  // List to store valid neighbors
  const neighbors = [];

  // The four possible directions (up, down, left, right)
  // Each moves 2 cells to skip over walls
  const directions = [
    [-2, 0], // Up
    [2, 0], // Down
    [0, -2], // Left
    [0, 2], // Right
  ];

  // Check each direction
  for (let i = 0; i < directions.length; i++) {
    const newRow = row + directions[i][0];
    const newCol = col + directions[i][1];

    // Check if this neighbor is valid and still a wall (unvisited)
    if (isValidCell(newRow, newCol) && maze[newRow][newCol] === WALL) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
}

/**
 * Check if a cell is valid (within bounds and not on the border)
 */
function isValidCell(row, col) {
  return row > 0 && row < MAZE_ROWS - 1 && col > 0 && col < MAZE_COLS - 1;
}

/**
 * Create the visual representation of the maze
 */
function displayMaze() {
  // Clear any existing maze
  mazeContainer.innerHTML = "";

  // Create the grid for our maze
  const mazeGrid = document.createElement("div");
  mazeGrid.className = "maze-grid";

  // Set grid dimensions
  mazeGrid.style.gridTemplateColumns = `repeat(${MAZE_COLS}, 1fr)`;
  mazeGrid.style.gridTemplateRows = `repeat(${MAZE_ROWS}, 1fr)`;

  // Create each cell
  for (let row = 0; row < MAZE_ROWS; row++) {
    for (let col = 0; col < MAZE_COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${row}-${col}`;

      // Add the right class based on what this cell is
      if (maze[row][col] === WALL) {
        cell.classList.add("wall");
      } else {
        cell.classList.add("path");
      }

      // Special styling for start and end cells
      if (row === START_ROW && col === START_COL) {
        cell.classList.add("start");
      } else if (row === END_ROW && col === END_COL) {
        cell.classList.add("end");
      }

      // Add the cell to our grid
      mazeGrid.appendChild(cell);
    }
  }

  // Add the grid to the page
  mazeContainer.appendChild(mazeGrid);
}

// ======== MAZE SOLVING ========
// Functions for finding a path through the maze

/**
 * Start solving the maze using DFS
 */
function solveMaze() {
  // Don't solve if we can't or shouldn't
  if (!doesMazeExist || isSolving || isSolved) {
    return;
  }

  console.log("Starting to solve the maze...");

  // Update status
  isSolving = true;
  updateStatus("Solving maze using Depth-First Search...");
  updateButtonStates();

  // Clear any previous solution
  clearVisualization();

  // Start the solving process
  // We need to use an async function for the animation
  startSolving();
}

/**
 * Begin the actual solving process
 */
async function startSolving() {
  try {
    // Keep track of visited cells and the path
    const visited = new Set();
    const path = [];

    // Start from the beginning
    const found = await depthFirstSearch(START_ROW, START_COL, visited, path);

    // Process the result
    if (found) {
      // Solution found!
      solutionPath = path;
      isSolved = true;

      // Show the solution path
      await highlightSolution();

      updateStatus(`Maze solved! Path found with ${path.length} steps.`);
    } else {
      // No solution found
      updateStatus("No solution found! The maze might be unsolvable.");
    }
  } catch (error) {
    console.error("Error solving maze:", error);
    updateStatus("An error occurred while solving the maze.");
  } finally {
    // Always reset solving state
    isSolving = false;
    updateButtonStates();
  }
}

/**
 * Depth-First Search algorithm
 * This is the main pathfinding algorithm
 */
async function depthFirstSearch(row, col, visited, path) {
  // Check if we've reached the end
  if (row === END_ROW && col === END_COL) {
    // Found the end! Add it to our path
    path.push({ row, col });
    return true;
  }

  // Check if this is a valid move
  if (!isValidMove(row, col, visited)) {
    return false;
  }

  // Mark this cell as visited
  const cellKey = `${row},${col}`;
  visited.add(cellKey);
  path.push({ row, col });

  // Visualize the current cell
  await updateCellVisual(row, col, "current");
  await sleep(SOLVING_SPEED);

  // Mark the cell as visited (except start and end)
  if (
    (row !== START_ROW || col !== START_COL) &&
    (row !== END_ROW || col !== END_COL)
  ) {
    await updateCellVisual(row, col, "visited");
  }

  // Try each of the four directions
  const directions = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
  ];

  for (let i = 0; i < directions.length; i++) {
    const newRow = row + directions[i][0];
    const newCol = col + directions[i][1];

    // Try going this way
    if (await depthFirstSearch(newRow, newCol, visited, path)) {
      return true; // Found a solution in this direction!
    }
  }

  // If we get here, no path was found in any direction
  // Backtrack - remove this cell from our path
  path.pop();
  return false;
}

/**
 * Check if a move is valid for pathfinding
 */
function isValidMove(row, col, visited) {
  // Check if:
  // 1. Inside the maze
  // 2. Cell is a path (not a wall)
  // 3. Not already visited

  const cellKey = `${row},${col}`;

  return (
    row >= 0 &&
    row < MAZE_ROWS && // Within vertical bounds
    col >= 0 &&
    col < MAZE_COLS && // Within horizontal bounds
    maze[row][col] === PATH && // Is a path (not a wall)
    !visited.has(cellKey) // Not already visited
  );
}

/**
 * Highlight the solution path
 */
async function highlightSolution() {
  console.log("Highlighting solution path...");

  for (let i = 0; i < solutionPath.length; i++) {
    const cell = solutionPath[i];

    // Skip start and end cells (they already have special styling)
    if (
      (cell.row === START_ROW && cell.col === START_COL) ||
      (cell.row === END_ROW && cell.col === END_COL)
    ) {
      continue;
    }

    await updateCellVisual(cell.row, cell.col, "solution");
    await sleep(SOLUTION_SPEED);
  }
}

/**
 * Update how a cell looks
 */
async function updateCellVisual(row, col, type) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (!cell) return;

  // Remove any existing special classes
  cell.classList.remove("current", "visited", "solution");

  // Add the new class
  cell.classList.add(type);
}

/**
 * Clear all the solving visualization from the maze
 */
function clearVisualization() {
  // Find all cells
  const cells = document.querySelectorAll(".cell");

  // Remove any solving-related classes
  cells.forEach((cell) => {
    cell.classList.remove("visited", "current", "solution", "user", "computer");
  });
}

/**
 * Clear the solution path
 */
function clearPath() {
  console.log("Clearing solution path...");

  clearVisualization();
  isSolved = false;
  solutionPath = [];

  updateStatus("Path cleared. Click 'Solve Maze' to find the path again.");
  updateButtonStates();
}

// ======== UTILITY FUNCTIONS ========
// Helper functions used in various places

/**
 * Update the status message shown to the user
 */
function updateStatus(message) {
  statusMessage.textContent = message;
}

/**
 * Enable/disable buttons based on current state
 */
function updateButtonStates(countingDown = false) {
  // If counting down before a race, disable all buttons
  if (countingDown) {
    solveButton.disabled = true;
    clearButton.disabled = true;
    generateButton.disabled = true;
    resetButton.disabled = true;
    startRaceButton.disabled = true;
    return;
  }

  // Normal button states
  solveButton.disabled = !doesMazeExist || isSolving || isSolved || raceActive;
  clearButton.disabled =
    !doesMazeExist || (!isSolving && !isSolved) || raceActive;
  generateButton.disabled = isSolving || raceActive;
  resetButton.disabled = isSolving || raceActive;
  startRaceButton.disabled = !doesMazeExist || isSolving;
  // Difficulty buttons have been removed
}

/**
 * Create a delay (for animation)
 */
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// ======== RACE MODE FUNCTIONS ========
// Functions for the user vs AI race

/**
 * Start a race between the user and the computer
 */
function startRace() {
  if (!doesMazeExist || raceActive) {
    return;
  }

  console.log("Starting race...");
  // Reset race state
  winner = null;
  userPosition = { row: START_ROW, col: START_COL };
  computerPosition = { row: START_ROW, col: START_COL };
  clearVisualization();

  // Get a path for the computer to follow
  findComputerPath();
  // Update UI and disable buttons during countdown
  updateStatus("Get ready...");
  updateButtonStates(true); // Disable all buttons during countdown

  // Render the initial positions of user and computer
  displayMaze();
  showPlayers();

  // Start the countdown before the race
  startCountdown();
}

/**
 * Start a countdown before the race begins
 */
async function startCountdown() {
  // Show countdown 3...2...1...Go!
  await sleep(500);
  updateStatus("3...");
  await sleep(1000);
  updateStatus("2...");
  await sleep(1000);
  updateStatus("1...");
  await sleep(1000);
  updateStatus("GO!");
  await sleep(500);

  // Now actually start the race
  raceActive = true;
  updateStatus("Race started! Use arrow keys or WASD to move.");
  updateButtonStates();

  // Start the computer's movement
  startComputerMovement();
}

/**
 * Find the path for the computer to follow
 */
async function findComputerPath() {
  const visited = new Set();
  computerPath = [];

  // Use DFS to find a path (simplified without animations)
  await findPath(START_ROW, START_COL, visited, computerPath);
}

/**
 * DFS algorithm for finding the computer's path (simplified version)
 */
async function findPath(row, col, visited, path) {
  // Check if we've reached the end
  if (row === END_ROW && col === END_COL) {
    path.push({ row, col });
    return true;
  }

  // Check if position is valid
  const cellKey = `${row},${col}`;
  if (!isValidMove(row, col, visited)) {
    return false;
  }

  // Mark as visited and add to path
  visited.add(cellKey);
  path.push({ row, col });

  // Try all four directions
  const directions = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
  ];

  for (let i = 0; i < directions.length; i++) {
    const newRow = row + directions[i][0];
    const newCol = col + directions[i][1];

    if (await findPath(newRow, newCol, visited, path)) {
      return true; // Path found!
    }
  }

  // No path found in any direction, backtrack
  path.pop();
  return false;
}

/**
 * Start the computer's automated movement
 */
function startComputerMovement() {
  let moveIndex = 1; // Start from the second position (after start)

  // Set up a timer to move the computer
  computerMoveInterval = setInterval(() => {
    if (moveIndex < computerPath.length) {
      // Move the computer to the next position
      computerPosition = computerPath[moveIndex];
      moveIndex++;

      // Update the display
      showPlayers();

      // Check if the computer has won
      checkWinCondition();
    } else {
      // Computer has reached the end of its path
      clearInterval(computerMoveInterval);
    }
  }, COMPUTER_MOVE_SPEED);
}

/**
 * Handle keyboard input for user movement
 */
function handleKeyPress(event) {
  // Only process keys if race is active
  if (!raceActive) {
    return;
  }

  // Check if restart key was pressed
  if (RESTART_KEYS.includes(event.code)) {
    resetRace();
    return;
  }

  // Store the current position
  const oldRow = userPosition.row;
  const oldCol = userPosition.col;

  // Check which direction key was pressed
  if (UP_KEYS.includes(event.code)) {
    userPosition.row--;
  } else if (DOWN_KEYS.includes(event.code)) {
    userPosition.row++;
  } else if (LEFT_KEYS.includes(event.code)) {
    userPosition.col--;
  } else if (RIGHT_KEYS.includes(event.code)) {
    userPosition.col++;
  } else {
    // Not a movement key, do nothing
    return;
  }

  // Check if the new position is valid
  if (!isValidUserMove(userPosition.row, userPosition.col)) {
    // If not valid, revert to old position
    userPosition.row = oldRow;
    userPosition.col = oldCol;
    return;
  }

  // Update the display
  showPlayers();

  // Check if the user has won
  checkWinCondition();
}

/**
 * Check if the user's move is valid
 */
function isValidUserMove(row, col) {
  // Check if within maze boundaries and is a path (not a wall)
  return (
    row >= 0 &&
    row < MAZE_ROWS &&
    col >= 0 &&
    col < MAZE_COLS &&
    maze[row][col] === PATH
  );
}

/**
 * Show user and computer positions on the maze
 */
function showPlayers() {
  // Clear previous player positions
  clearPlayerVisuals();

  // Show the user's position
  if (userPosition.row !== END_ROW || userPosition.col !== END_COL) {
    updateCellVisual(userPosition.row, userPosition.col, "user");
  }

  // Show the computer's position
  if (computerPosition.row !== END_ROW || computerPosition.col !== END_COL) {
    updateCellVisual(computerPosition.row, computerPosition.col, "computer");
  }
}

/**
 * Clear player visuals from the maze
 */
function clearPlayerVisuals() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("user", "computer");
  });
}

/**
 * Check if either player has won
 */
function checkWinCondition() {
  // Check if user has reached the end
  if (userPosition.row === END_ROW && userPosition.col === END_COL) {
    endRace("user");
    return;
  }

  // Check if computer has reached the end
  if (computerPosition.row === END_ROW && computerPosition.col === END_COL) {
    endRace("computer");
    return;
  }
}

/**
 * End the race and declare a winner
 */
function endRace(winnerName) {
  raceActive = false;
  winner = winnerName;

  // Stop the computer's movement
  clearInterval(computerMoveInterval);

  // Update the score
  if (winner === "user") {
    playerWins++;
    document.getElementById("playerScore").textContent = playerWins;
    updateStatus("🎉 You won! Press 'R' to race again.");
  } else {
    computerWins++;
    document.getElementById("computerScore").textContent = computerWins;
    updateStatus("The computer won! Press 'R' to try again.");
  }

  // Update button states
  updateButtonStates();
}

/**
 * Reset the race
 */
function resetRace() {
  // Stop any ongoing race
  if (computerMoveInterval) {
    clearInterval(computerMoveInterval);
  }

  // Start a new race
  startRace();
}

// Difficulty selection function has been removed since we're using fixed medium difficulty
