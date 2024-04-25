import {cloneDeep} from "lodash";
import {BinaryMazeGenerator} from "./binary-maze-generator";
import {SidewinderMazeGenerator} from "./sidewinder-maze-generator";

export class Maze {
  private readonly grid: Grid;

  constructor(private config: MazeConfig) {
    this.grid = this.newGrid();
  }

  getConfig(): MazeConfig {
    return this.config;
  }

  cloneGrid() {
    const copy: Grid = [[]];
    for (let row = 0; row < this.grid.length; row++) {
      copy[row] = [];
      for (let col = 0; col < this.grid[0].length; col++) {
        copy[row][col] = cloneDeep(this.grid[row][col]);
      }
    }
    return copy;
  }

  getCell(column: number, row: number): Cell | undefined {
    if (this.inBound(column, row)) {
      return this.grid[row][column];
    }
    return undefined;
  }

  inBound(column: number, row: number): boolean {
    return 0 <= column && column < this.config.columns && (0 <= row && row < this.config.rows);
  }

  connect(a: Cell | undefined, b: Cell | undefined) {
    if (a === undefined || b === undefined) {
      return;
    }

    if (a.y + 1 === b.y) {
      a.wall.south = false;
      b.wall.north = false;
    } else if (a.x + 1 === b.x) {
      a.wall.east = false;
      b.wall.west = false;
    } else if (a.y - 1 === b.y) {
      a.wall.north = false;
      b.wall.south = false;
    } else if (a.x - 1 === b.x) {
      a.wall.west = false;
      b.wall.east = false;
    }
  }

  private newGrid(): Grid {
    const grid: Grid = [[]];
    for (let row = 0; row < this.config.rows; row++) {
      grid[row] = [];
      for (let col = 0; col < this.config.columns; col++) {
        grid[row][col] = {
          x: col,
          y: row,
          visited: false,
          wall: {
            north: true,
            east: true,
            south: true,
            west: true
          }
        };
      }
    }
    return grid;
  }
}

export interface Cell {
  x: number;
  y: number;
  visited: boolean;
  wall: {
    north: boolean;
    east: boolean;
    south: boolean;
    west: boolean;
  };
}

export type Grid = Cell[][];

export interface MazeConfig {
  rows: number;
  columns: number;
}

export type Result = {
  steps: Grid[];
};

export interface MazeGenerator {
  generate(): Result;
}

export type MazeGeneratorBuilder = (maze: Maze) => MazeGenerator;
export const MazeGenerators = {
  Binary: (maze: Maze) => new BinaryMazeGenerator(maze),
  Sidewinder: (maze: Maze) => new SidewinderMazeGenerator(maze)
};
