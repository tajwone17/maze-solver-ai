/**
 * Application Entry Point
 * This file initializes the maze solver application when the page loads
 */

import { MazeApp } from "./main.js";

// Global reference to the application (for debugging in browser console)
let mazeApp = null;

/**
 * Initialize the application when the DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing Maze Solver...");

  try {
    // Create and start the application
    mazeApp = new MazeApp();

    // Make it globally accessible for debugging
    window.mazeApp = mazeApp;

    console.log("Maze Solver initialized successfully!");
    console.log("You can access the app via window.mazeApp in the console");
  } catch (error) {
    console.error("Failed to initialize Maze Solver:", error);

    // Show error message to user
    const statusElement = document.getElementById("statusText");
    if (statusElement) {
      statusElement.textContent =
        "Failed to initialize application. Please refresh the page.";
      statusElement.style.color = "red";
    }
  }
});

/**
 * Handle any unhandled errors
 */
window.addEventListener("error", (event) => {
  console.error("Unhandled error in Maze Solver:", event.error);
});

/**
 * Export for potential external use
 */
export { mazeApp };
