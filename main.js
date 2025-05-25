/**
 * Main Application Controller
 * This file orchestrates all the components and manages the application state
 */

import { MazeGenerator } from "./maze-generator.js";
import { DFSSolver } from "./dfs-solver.js";
import { UIController } from "./ui-controller.js";
import { GameController } from "./game-controller.js";
import { MESSAGES, POSITIONS, CELL_TYPES } from "./config.js";

export class MazeApp {
  constructor() {
    // Initialize application state
    this.state = {
      solving: false, // Is the maze currently being solved?
      solved: false, // Has the maze been solved?
      mazeExists: false, // Does a maze currently exist?
    }; // Initialize components
    this.ui = new UIController();
    this.mazeGenerator = new MazeGenerator();
    this.dfsSolver = null; // Will be created when needed
    this.gameController = null; // Will be created for race mode

    this.currentMaze = null;
    this.solutionPath = [];
    this.raceMode = false;

    this.initialize();
  }

  /**
   * Initialize the application
   * Sets up event listeners and generates the first maze
   */
  initialize() {
    console.log("Initializing Maze Solver Application...");

    // Setup UI event listeners
    this.setupEventListeners();

    // Generate initial maze
    this.generateNewMaze();

    console.log("Application initialized successfully");
  }
  /**
   * Setup event listeners for UI interactions
   */
  setupEventListeners() {
    const callbacks = {
      onGenerate: () => this.generateNewMaze(),
      onSolve: () => this.solveMaze(),
      onClear: () => this.clearPath(),
      onReset: () => this.resetApplication(),
      onStartRace: () => this.startRace(),
    };

    this.ui.setupEventListeners(callbacks);
  }

  /**
   * Generate a new maze
   * Creates a fresh maze and resets the application state
   */
  generateNewMaze() {
    console.log("Generating new maze...");

    // Reset application state
    this.resetState();

    // Generate new maze
    this.currentMaze = this.mazeGenerator.generateMaze();

    // Ensure start and end positions are accessible
    this.ensureStartEndAccessible();

    // Render the maze
    this.ui.renderMaze(this.currentMaze);

    // Update UI
    this.state.mazeExists = true;
    this.ui.updateStatus(MESSAGES.MAZE_GENERATED);
    this.updateUI();

    console.log("New maze generated successfully");
  }

  /**
   * Ensure start and end positions are accessible paths
   */
  ensureStartEndAccessible() {
    this.currentMaze[POSITIONS.START.row][POSITIONS.START.col] =
      CELL_TYPES.PATH;
    this.currentMaze[POSITIONS.END.row][POSITIONS.END.col] = CELL_TYPES.PATH;
  }

  /**
   * Solve the current maze using DFS algorithm
   */
  async solveMaze() {
    if (!this.canStartSolving()) {
      return;
    }

    console.log("Starting maze solving process...");

    // Update state and UI
    this.state.solving = true;
    this.ui.updateStatus(MESSAGES.SOLVING);
    this.ui.showLoadingState();
    this.updateUI();

    try {
      // Clear any previous solution
      this.clearPath();

      // Create DFS solver with current maze
      this.dfsSolver = new DFSSolver(this.currentMaze, this.ui);

      // Solve the maze
      const result = await this.dfsSolver.solveMaze();

      // Process results
      await this.processSolutionResult(result);
    } catch (error) {
      console.error("Error during maze solving:", error);
      this.ui.updateStatus("An error occurred while solving the maze.");
    } finally {
      // Always reset solving state
      this.state.solving = false;
      this.updateUI();
    }
  }

  /**
   * Process the result from the DFS solver
   * @param {Object} result - Result object from DFS solver
   */
  async processSolutionResult(result) {
    if (result.success) {
      console.log("Maze solved successfully!");

      // Store solution path
      this.solutionPath = result.path;
      this.state.solved = true;

      // Highlight the solution path
      await this.dfsSolver.highlightSolutionPath(result.path);

      // Update status with statistics
      const stats = this.dfsSolver.getSearchStatistics(
        result.path,
        result.visitedCount
      );
      this.ui.updateStatus(MESSAGES.SOLVED(result.path.length));

      console.log("Solution statistics:", stats);
    } else {
      console.log("No solution found");
      this.ui.updateStatus(MESSAGES.NO_SOLUTION);
    }
  }

  /**
   * Clear the current solution path from the display
   */
  clearPath() {
    console.log("Clearing solution path...");

    this.ui.clearPathVisuals();
    this.solutionPath = [];
    this.state.solved = false;

    this.ui.updateStatus(MESSAGES.PATH_CLEARED);
    this.updateUI();
  }

  /**
   * Reset the entire application
   */
  resetApplication() {
    console.log("Resetting application...");
    this.generateNewMaze();
  }

  /**
   * Reset application state to initial values
   */
  resetState() {
    this.state = {
      solving: false,
      solved: false,
      mazeExists: false,
    };
    this.solutionPath = [];
  }

  /**
   * Check if solving can be started
   * @returns {boolean} True if solving can start
   */
  canStartSolving() {
    if (!this.state.mazeExists) {
      console.warn("No maze exists to solve");
      return false;
    }

    if (this.state.solving) {
      console.warn("Already solving maze");
      return false;
    }

    if (this.state.solved) {
      console.warn("Maze already solved");
      return false;
    }

    return true;
  }

  /**
   * Update UI elements based on current state
   */
  updateUI() {
    this.ui.updateButtonStates(this.state);
  }

  /**
   * Get current application statistics
   * @returns {Object} Current application statistics
   */
  getStatistics() {
    return {
      state: { ...this.state },
      solutionLength: this.solutionPath.length,
      mazeSize: {
        rows: this.mazeGenerator.rows,
        cols: this.mazeGenerator.cols,
      },
    };
  }

  /**
   * Get the current maze for external inspection
   * @returns {Array} Current maze as 2D array
   */
  getCurrentMaze() {
    return this.currentMaze;
  }

  /**
   * Get the current solution path
   * @returns {Array} Array of {row, col} objects representing the solution path
   */
  getSolutionPath() {
    return [...this.solutionPath]; // Return copy to prevent modification
  }

  /**
   * Start a race between user and computer
   */
  async startRace() {
    console.log("Starting race mode...");

    if (!this.state.mazeExists) {
      this.generateNewMaze();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for maze generation
    }

    // Switch to race mode
    this.raceMode = true;
    this.resetState();

    // Create DFS solver for the computer
    this.dfsSolver = new DFSSolver(this.currentMaze, this.ui);

    // Create game controller
    this.gameController = new GameController(
      this.currentMaze,
      this.ui,
      this.dfsSolver
    );

    // Start the race
    await this.gameController.startRace();

    // Update UI state
    this.state.mazeExists = true;
    this.updateUI();

    console.log("Race started!");
  }
}
