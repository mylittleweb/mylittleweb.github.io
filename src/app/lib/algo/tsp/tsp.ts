import _ from "lodash";

export type City = {
  x: number;
  y: number;
};

export class TSP {
  cities: City[] = [];

  generateCities(n: number): City[] {
    this.cities = [];
    for (let i = 0; i < n; i++) {
      this.cities.push({
        x: _.random(0, 100),
        y: _.random(0, 100)
      });
    }

    return this.cities;
  }

  pathCost(cities: City[]): number {
    let cost = 0;
    for (let i = 0; i < cities.length - 1; i++) {
      cost += this.cityDistance(cities[i], cities[i + 1]);
    }
    cost += this.cityDistance(cities[cities.length - 1], cities[0]);
    return cost;
  }

  cityDistance(c1: City, c2: City): number {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export interface TSPSolver {
  setProblem(tsp: TSP): void;
  run(): Step;
}

export type Step = {
  i: number;
  iY: number;
  path: City[];
  cost: number;
  done: boolean;
};
