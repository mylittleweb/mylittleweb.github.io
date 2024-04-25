import {Cell, Grid, Maze, MazeGenerator, Result} from "./maze";

export class SidewinderMazeGenerator implements MazeGenerator {

  constructor(private maze: Maze) {}

  generate(): Result {
    const steps: Grid[] = [];

    const config = this.maze.getConfig();
    for (let row = 0; row < config.rows; row++) {
      let run: Cell[] = [];
      for (let column = 0; column < config.columns; column++) {
        const cell = this.maze.getCell(column, row) as Cell;
        cell.visited = true;
        run.push(cell);
        if (run.length > 0) {
          this.maze.connect(cell, run[run.length - 2]);
        }

        const carveNorth = cell.y !== 0 && (cell.x === config.columns - 1 || Math.random() < 0.3333333);
        if (carveNorth) {
          const i = Math.floor(Math.random() * run.length);
          this.maze.connect(run[i], this.maze.getCell(run[i].x, run[i].y - 1));
          run = [];
        }
        steps.push(this.maze.cloneGrid());
      }
    }

    return {steps: steps};
  }
}
