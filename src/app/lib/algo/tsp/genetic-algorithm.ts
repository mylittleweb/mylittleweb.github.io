import {City, Step, TSP, TSPSolver} from "./tsp";
import _ from "lodash";

export class GeneticAlgorithm implements TSPSolver {
  private i = 0;
  private bestCost = Number.MAX_VALUE;
  private bestPath: City[] = [];
  private done = false;

  private tsp: TSP;

  population: City[][] = [];

  constructor(private conf: GAParameters) {
  }

  setProblem(tsp: TSP) {
    this.done = false;
    this.i = 0;
    this.bestCost = Number.MAX_VALUE;
    this.bestPath = [];

    this.tsp = tsp;
    this.generateInitialPopulation();
  }

  run(): Step {
    if (this.i < this.conf.generations) {
      let samples: TSPSample[] = this.population.map(path => {
        return {
          path: path, cost: this.tsp.pathCost(path)
        };
      });

      samples = _.sortBy(samples, "cost");
      if (samples[0].cost < this.bestCost) {
        this.bestPath = samples[0].path;
        this.bestCost = samples[0].cost;
      }

      const nextGeneration: City[][] = [];
      while (nextGeneration.length < this.conf.population) {
        const child = this.crossover(this.select(samples), this.select(samples));
        nextGeneration.push(this.mutate(child));
      }
      this.population = nextGeneration;

      const step = {
        i: this.i,
        iY: this.i,
        path: [...samples[0].path, samples[0].path[0]],
        cost: samples[0].cost,
        done: this.done
      };
      this.i += 1;

      return step;
    }

    const best = {
      i: this.i,
      iY: this.i,
      path: [...this.bestPath, this.bestPath[0]],
      cost: this.bestCost,
      done: this.done
    };
    this.done = true;
    this.i += 1;
    return best;
  }

  generateInitialPopulation() {
    this.population = [];
    for (let i = 0; i < this.conf.population; i++) {
      this.population.push(_.shuffle(this.tsp.cities));
    }
  }

  select(samples: TSPSample[]) {
    // select from top 30%
    return samples[_.random(0, Math.floor(samples.length / 3))];
  }

  crossover(p1: TSPSample, p2: TSPSample): City[] {
    if (Math.random() < this.conf.crossOverRate) {
      const start = Math.floor(Math.random() * p1.path.length);
      const end = start + Math.floor(Math.random() * (p1.path.length - start));

      const firstHalf = p1.path.slice(start, end);
      const existingCities = firstHalf.reduce((m, c) => {
        m[c.x] = m[c.x] || [];
        m[c.x][c.y] = true;
        return m;
      }, [] as boolean[][]);

      const secondHalf = p2.path.filter(c => {
        return !existingCities?.[c.x]?.[c.y];
      });

      return [...firstHalf, ...secondHalf];
    } else {
      return p1.cost < p2.cost ? p1.path : p2.path;
    }
  }

  mutate(c: City[]): City[] {
    if (Math.random() < this.conf.mutationRate) {
      const i = Math.floor(Math.random() * c.length);
      let j = Math.floor(Math.random() * c.length);
      while (j === i) j = Math.floor(Math.random() * c.length);

      const [start, end] = [Math.min(i, j), Math.max(i, j)];
      return [
        ...c.slice(0, start),
        ...c.slice(start, end + 1).reverse(),
        ...c.slice(end + 1)
      ];
    }
    return c;
  }
}

export type GAParameters = {
  population: number;
  mutationRate: number;
  crossOverRate: number;
  generations: number;
};

type TSPSample = {
  path: City[];
  cost: number;
};
