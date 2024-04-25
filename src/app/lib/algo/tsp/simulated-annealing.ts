import {City, Step, TSP, TSPSolver} from "./tsp";
import _ from "lodash";

export type SAParameters = {
  initialTemp: number;
  coolingRate: number;
  minTemp: number;
};

export class SimulatedAnnealing implements TSPSolver {
  private i = 0;
  private bestCost = Number.MAX_VALUE;
  private bestPath: City[] = [];
  private done = false;

  private temp: number;
  private path: City[];
  private pathCost: number;

  private tsp: TSP;

  constructor(private params: SAParameters) {
    this.temp = params.initialTemp;
  }

  setProblem(tsp: TSP) {
    this.done = false;
    this.i = 0;
    this.bestCost = Number.MAX_VALUE;
    this.bestPath = [];

    this.tsp = tsp;
    this.path = tsp.cities;
    this.pathCost = tsp.pathCost(this.path);
  }

  run(): Step {
    if (this.temp > this.params.minTemp) {
      const newPath = this.randomNeighbour(_.cloneDeep(this.path));
      const newPathCost = this.tsp.pathCost(newPath);
      const delta = newPathCost - this.pathCost;
      if (delta < 0 || Math.random() < Math.exp(-delta / this.temp)) {
        this.path = newPath;
        this.pathCost = newPathCost;
        if (this.pathCost < this.bestCost) {
          this.bestCost = this.pathCost;
          this.bestPath = this.path;
        }
      }

      this.i += 1;
      this.temp = this.temp * this.params.coolingRate;

      return {
        i: this.i,
        path: [..._.cloneDeep(this.path), _.cloneDeep(this.path[0])],
        cost: this.pathCost,
        iY: this.temp,
        done: this.done
      };
    }

    const best = {
      i: this.i,
      path: [...this.bestPath, this.bestPath[0]],
      cost: this.bestCost,
      iY: this.temp,
      done: this.done
    };
    this.done = true;
    this.i += 1;
    return best;
  }

  randomNeighbour(path: City[]): City[] {
    // // randomly swap 2 cities
    // const [i, j] = [_.random(0, cities.length - 1), _.random(cities.length - 1)];
    // [cities[i], cities[j]] = [cities[j], cities[i]];
    // return cities;

    //  2-opt Swap
    const i = Math.floor(Math.random() * path.length);
    let j = Math.floor(Math.random() * path.length);
    while (j === i) j = Math.floor(Math.random() * path.length);

    const [start, end] = [Math.min(i, j), Math.max(i, j)];
    return [
      ...path.slice(0, start),
      ...path.slice(start, end + 1).reverse(),
      ...path.slice(end + 1)
    ];
  }
}
