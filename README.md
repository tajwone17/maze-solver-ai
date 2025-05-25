# 🎮 Maze Race Game - User vs Computer AI

A competitive maze race game where you compete against an AI computer using the Depth-First Search (DFS) algorithm. The game features real-time movement, intelligent AI pathfinding, and exciting race dynamics!

## 🎯 Game Features

### 🏁 Race Mode

- **Player vs Computer**: Race against an AI that uses DFS to find the optimal path
- **Real-time Movement**: Use WASD or arrow keys for instant player movement
- **Smart AI**: Computer finds and follows the optimal path step-by-step
- **Win Detection**: First to reach the goal wins with celebration animations
- **Restart Capability**: Press R to restart or click "New Game"

### 🎨 Visual Features

- **Player Distinction**: Blue circle with 👤 for user, pink circle with 🤖 for computer
- **Animated Elements**: Pulsing players, win animations, and smooth transitions
- **Real-time Updates**: See both players moving simultaneously
- **Beautiful UI**: Modern gradient design with responsive layout

### 🧠 AI Features

- **DFS Pathfinding**: Computer uses Depth-First Search to find paths
- **Optimal Strategy**: AI always finds a valid path to the goal
- **Visualized Thinking**: Watch the AI explore and backtrack (in solve mode)
- **Fair Competition**: AI moves at a reasonable speed for fair gameplay

## 📂 Project Structure

```
maze-solver-ai/
├── index.html          # Main HTML page
├── styles.css          # All styling and animations
├── app.js             # Application entry point
├── main.js            # Main application controller
├── config.js          # Configuration and constants
├── maze-generator.js  # Maze generation logic
├── dfs-solver.js      # DFS pathfinding algorithm
├── ui-controller.js   # DOM manipulation and visuals
└── STRUCTURE_GUIDE.md # 📖 Complete code explanation
```

**🎓 New to the code?** Start with `STRUCTURE_GUIDE.md` - it explains everything!

## How It Works

### Maze Representation

- The maze is represented as a 2D array where:
  - `0` = Wall (impassable)
  - `1` = Path (walkable)

### DFS Algorithm

1. **Start** at the green cell (start position)
2. **Explore** all possible directions (up, down, left, right)
3. **Mark** visited cells (orange)
4. **Backtrack** when reaching dead ends
5. **Continue** until reaching the red cell (end position)
6. **Highlight** the final solution path (purple)

### Maze Generation

- Uses recursive backtracking algorithm
- Ensures all areas are reachable
- Creates challenging but solvable mazes

## File Structure

```
maze-solver-ai/
├── index.html          # Main HTML page
├── styles.css          # All styling and animations
├── app.js             # Application entry point
├── main.js            # Main application controller
├── config.js          # Configuration and constants
├── maze-generator.js  # Maze generation logic
├── dfs-solver.js      # DFS pathfinding algorithm
├── ui-controller.js   # DOM manipulation and visuals
├── STRUCTURE_GUIDE.md # Complete code explanation
└── README.md          # This file
```

## 🚀 Quick Start

### Option 1: Race Mode (Recommended!)

1. Open `index.html` in a web browser
2. Click **"Start Race!"** to begin the competition
3. Use **WASD** or **Arrow Keys** to move your player (👤)
4. Race against the computer (🤖) to reach the red goal first!
5. Press **R** to restart when the game ends

### Option 2: Algorithm Visualization

1. Click **"Generate New Maze"** to create a random maze
2. Click **"Solve Maze"** to watch DFS find the path step-by-step
3. Use other buttons to interact with the maze

## 🎮 How to Play the Race

1. **Start**: Click "Start Race!" button
2. **Move**: Use WASD keys or Arrow keys:
   - W/↑ - Move Up
   - S/↓ - Move Down
   - A/← - Move Left
   - D/→ - Move Right
3. **Goal**: Be the first to reach the red end cell
4. **Restart**: Press R key or click "Start Race!" again
5. **New Maze**: Click "Generate New Maze" for a fresh challenge

## 🎯 Game Elements

| Element      | Appearance | Description                       |
| ------------ | ---------- | --------------------------------- |
| **Player**   | 🔵👤       | You! Blue circle with person icon |
| **Computer** | 🌸🤖       | AI opponent with robot icon       |
| **Start**    | 🟢         | Green cell - starting position    |
| **Goal**     | 🔴         | Red cell - finish line            |
| **Wall**     | ⬛         | Dark blue barriers                |
| **Path**     | ⬜         | Light gray walkable areas         |

## 🧠 AI Strategy

The computer opponent uses the **Depth-First Search (DFS)** algorithm:

1. **Pathfinding**: Finds a valid route from start to goal
2. **Exploration**: Systematically explores all possible paths
3. **Backtracking**: Returns when hitting dead ends
4. **Optimization**: Follows the discovered path efficiently
5. **Fair Play**: Moves at human-comparable speed

## 📚 Understanding the Code

**New to programming or want to understand how it works?**
👉 **Read `STRUCTURE_GUIDE.md`** - it explains every file and concept in detail!

## Algorithm Details

### Depth-First Search (DFS)

```javascript
async dfs(row, col, visited, path) {
    // Base cases: reached end, out of bounds, wall, or already visited
    if (row === this.end.row && col === this.end.col) return true;
    if (/* invalid conditions */) return false;

    // Mark current cell as visited
    visited.add(`${row},${col}`);
    path.push({ row, col });

    // Explore all four directions
    for (const [dRow, dCol] of directions) {
        if (await this.dfs(newRow, newCol, visited, path)) {
            return true; // Solution found
        }
    }

    // Backtrack if no solution found
    path.pop();
    return false;
}
```

### Key Features of Implementation

- **Recursive approach**: Uses call stack for backtracking
- **Visited tracking**: Prevents infinite loops
- **Path recording**: Maintains the current path for solution highlighting
- **Animation delays**: Visual feedback with `await sleep()` calls
- **Boundary checking**: Ensures algorithm stays within maze bounds

## Cell Types & Colors

| Type     | Color      | Description                  |
| -------- | ---------- | ---------------------------- |
| Wall     | Dark Blue  | Impassable barriers          |
| Path     | Light Gray | Walkable areas               |
| Start    | Green      | Starting position            |
| End      | Red        | Target destination           |
| Visited  | Orange     | Cells explored by DFS        |
| Current  | Blue       | Currently exploring cell     |
| Solution | Purple     | Final path from start to end |

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- Maze size: 21x31 grid (651 cells)
- Animation speed: Configurable (50ms per step)
- Memory usage: Minimal (efficient visited set tracking)

## Future Enhancements

- [ ] Add other pathfinding algorithms (A\*, Dijkstra, BFS)
- [ ] Configurable maze size
- [ ] Speed controls for animation
- [ ] Save/load maze patterns
- [ ] Multiple start/end points
- [ ] 3D maze visualization

## Technical Notes

- Uses ES6+ features (classes, async/await, destructuring)
- CSS Grid for maze layout
- CSS animations for smooth transitions
- Responsive design with media queries
- No external dependencies

---

**Created with ❤️ for educational purposes**
