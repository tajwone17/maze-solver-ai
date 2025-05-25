# Maze Solver AI - Depth-First Search Algorithm

A visual maze solver that demonstrates the Depth-First Search (DFS) algorithm in action. The application generates random mazes and solves them step-by-step with beautiful animations.

## Features

- **Random Maze Generation**: Uses recursive backtracking to create solvable mazes
- **DFS Algorithm**: Implements Depth-First Search to find paths from start to end
- **Visual Animation**: Shows the algorithm in action with real-time cell updates
- **Interactive Controls**: Generate new mazes, solve, clear paths, and reset
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

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
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and animations
├── script.js       # JavaScript logic and DFS implementation
└── README.md       # Project documentation
```

## Usage

1. Open `index.html` in a web browser
2. Click **"Generate New Maze"** to create a random maze
3. Click **"Solve Maze"** to watch the DFS algorithm find the path
4. Use **"Clear Path"** to remove the solution and try again
5. Use **"Reset"** to generate a completely new maze

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

| Type | Color | Description |
|------|-------|-------------|
| Wall | Dark Blue | Impassable barriers |
| Path | Light Gray | Walkable areas |
| Start | Green | Starting position |
| End | Red | Target destination |
| Visited | Orange | Cells explored by DFS |
| Current | Blue | Currently exploring cell |
| Solution | Purple | Final path from start to end |

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

- [ ] Add other pathfinding algorithms (A*, Dijkstra, BFS)
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
