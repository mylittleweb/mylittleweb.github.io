import {City, Step, TSP, TSPSolver} from "./tsp";

export class AntColonyOptimization implements TSPSolver {
  private i = 0;
  private bestCost = Number.MAX_VALUE;
  private bestPath: City[] = [];
  private done = false;

  private tsp: TSP;
  private distances: number[][] = [];
  private pheromones: number[][] = [];

  constructor(private conf: ACOParameters) {
  }

  setProblem(tsp: TSP): void {
    this.done = false;
    this.i = 0;
    this.bestCost = Number.MAX_VALUE;
    this.bestPath = [];

    this.tsp = tsp;
    this.distances = this.cityDistance(tsp.cities);
    this.pheromones = Array.from({length: this.tsp.cities.length}, () => {
      return new Array(this.tsp.cities.length).fill(1);
    });
  }

  run(): Step {
    if (this.i < this.conf.iteration) {
      const ants = this.createAnts();
      this.buildSolution(ants);
      this.updatePheromones(ants);
      this.updateBestTour(ants);

      this.i += 1;
    }

    const best = {
      i: this.i,
      iY: this.i,
      path: [...this.bestPath, this.bestPath[0]],
      cost: this.bestCost,
      done: this.done
    };
    if (this.i >= this.conf.iteration) {
      this.done = true;
    }

    return best;
  }

  cityDistance(cities: City[]) {
    const distances: number[][] = [];
    for (let i = 0; i < cities.length; i++) {
      distances[i] = [];
      for (let j = 0; j < cities.length; j++) {
        const dx = cities[i].x - cities[j].x;
        const dy = cities[i].y - cities[j].y;
        distances[i][j] = Math.sqrt(dx * dx + dy * dy);
      }
    }
    return distances;
  }

  createAnts() {
    return Array.from({length: this.tsp.cities.length}, () => {
      const start = Math.floor(Math.random() * this.tsp.cities.length);
      return new Ant(this.tsp.cities.length, start);
    });
  }

  buildSolution(ants: Ant[]) {
    for (const ant of ants) {
      while (!ant.hasVisitedAllCities()) {
        const currentCity = ant.currentCity;
        const nextCity = this.selectNextCity(currentCity, ant.visited);
        ant.visitCity(nextCity);
        ant.distance += this.distances[currentCity][nextCity];
      }
      ant.distance += this.distances[ant.cities[ant.cities.length - 1]][ant.cities[0]];
    }
  }

  selectNextCity(currentCity: number, visited: boolean[]): number {
    let total = 0;
    const probabilities = new Array(this.tsp.cities.length).fill(0);
    for (let nextCity = 0; nextCity < this.tsp.cities.length; nextCity++) {
      if (!visited[nextCity]) {
        const pheromone = this.pheromones[currentCity][nextCity];
        const heuristic = 1 / this.distances[currentCity][nextCity];
        probabilities[nextCity] = Math.pow(pheromone, this.conf.alpha) * Math.pow(heuristic, this.conf.beta);
        total += probabilities[nextCity];
      }
    }

    // Roulette wheel selection
    const rand = Math.random() * total;
    let sum = 0;
    for (let i = 0; i < this.tsp.cities.length; i++) {
      if (!visited[i]) {
        sum += probabilities[i];
        if (sum >= rand) {
          return i;
        }
      }
    }

    // Fallback: pick a random unvisited city
    const unvisited = [];
    for (let i = 0; i < this.tsp.cities.length; i++) {
      if (!visited[i]) {
        unvisited.push(i);
      }
    }
    return unvisited[Math.floor(Math.random() * unvisited.length)];
  }

  updatePheromones(ants: Ant[]) {
    // evaporate pheromones
    for (let i = 0; i < this.tsp.cities.length; i++) {
      for (let j = 0; j < this.tsp.cities.length; j++) {
        this.pheromones[i][j] = this.pheromones[i][j] * (1 - this.conf.evaporationRate);
      }
    }

    // deposit pheromones
    for (const ant of ants) {
      const contribution = 1 / ant.distance;
      const cities = ant.cities;
      for (let c = 0; c < cities.length - 1; c++) {
        const [from, to] = [cities[c], cities[c + 1]];
        this.pheromones[from][to] += contribution;
        this.pheromones[to][from] += contribution;
      }
    }
  }

  updateBestTour(ants: Ant[]) {
    for (const ant of ants) {
      if (ant.distance < this.bestCost) {
        this.bestCost = ant.distance;
        this.bestPath = ant.cities.map(i => this.tsp.cities[i]);
      }
    }
  }
}


class Ant {
  cities: number[] = [];
  distance: number = 0;
  visited: boolean[];

  constructor(cities: number, startCity: number) {
    this.visited = new Array(cities).fill(false);
    this.visitCity(startCity);
  }

  public visitCity(idx: number): void {
    if (!this.visited[idx]) {
      this.visited[idx] = true;
      this.cities.push(idx);
    }
  }

  public hasVisitedAllCities(): boolean {
    return this.cities.length === this.visited.length;
  }

  public get currentCity(): number {
    return this.cities.length > 0 ? this.cities[this.cities.length - 1] : -1;
  }
}

export type ACOParameters = {
  ants: number;
  evaporationRate: number;
  alpha: number; // pheromone weight
  beta: number;   // heuristic weight
  iteration: number;
};
