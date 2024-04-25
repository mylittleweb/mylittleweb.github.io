import {Cell, Maze, MazeGenerator, Result} from "./maze";

export class BinaryMazeGenerator implements MazeGenerator {
  constructor(private maze: Maze) {}

  generate(): Result {
    const config = this.maze.getConfig();
    const steps = [this.maze.cloneGrid()];
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.columns; col++) {
        const cell = this.maze.getCell(col, row) as Cell;
        cell.visited = true;
        const neighbours = this.expand(cell);
        if (neighbours.length > 0) {
          const i = Math.floor(Math.random() * neighbours.length);
          this.maze.connect(cell, neighbours[i]);
          steps.push(this.maze.cloneGrid());
        }
      }
    }

    return {steps: steps};
  }

  private expand(cell: Cell): Cell[] {
    const northEast = [
      {y: cell.y - 1,
        x: cell.x}, // north
      {y: cell.y,
        x: cell.x - 1}  // east
    ];
    const neighbours: Cell[] = [];
    for (const n of northEast) {
      if (this.maze.inBound(n.x, n.y)) {
        neighbours.push(this.maze.getCell(n.x, n.y) as Cell);
      }
    }
    return neighbours;
  }
}
