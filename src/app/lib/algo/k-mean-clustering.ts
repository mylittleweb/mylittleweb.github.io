export type Point = {
  x: number;
  y: number;
};

export type Step = {
  centroids: Point[];
  clusters: Point[][];
};

export class KMeanClustering {
  constructor(private k: number, private maxIter: number, private tolerance: number, private data: Point[]) {}

  run(): Step[] {
    const steps: Step[] = [];

    let centroids = this.initCentroids();
    for (let i = 0; i < this.maxIter; i++) {
      const clusters = this.assignClusters(centroids);
      steps.push({
        centroids: centroids,
        clusters: clusters
      });

      const newCentroids = this.updateCentroids(clusters, centroids);

      if (this.converged(centroids, newCentroids, this.tolerance)) {
        break;
      }

      centroids = newCentroids;
    }

    return steps;
  }

  private initCentroids():  Point[] {
    const randomIdx = new Set<number>();
    while (randomIdx.size < this.k) {
      const idx = Math.floor(Math.random() * this.data.length);
      randomIdx.add(idx);
    }
    return Array.from(randomIdx).map(idx => this.data[idx]);
  }

  private assignClusters(centroids: Point[]) {
    const clusters: Point[][] = Array.from({length: centroids.length}, () => []);
    for (const p of this.data) {
      let closestCentroid = 0;
      let closestDistance = this.euclideanDistance(p, centroids[closestCentroid]);
      for (let i = 1; i < centroids.length; i += 1) {
        const distance = this.euclideanDistance(p, centroids[i]);
        if (distance < closestDistance) {
          closestCentroid = i;
          closestDistance = distance;
        }
      }
      clusters[closestCentroid].push(p);
    }
    return clusters;
  }

  private updateCentroids(clusters: Point[][], centroids: Point[]): Point[] {
    return clusters.map((cluster, i) => {
      if (cluster.length === 0) {
        return centroids[i];
      }

      const sum = cluster.reduce((acc, point) => {
        acc.x += point.x;
        acc.y += point.y;
        return acc;
      }, {x: 0, y: 0});
      return {
        x: sum.x / cluster.length,
        y: sum.y / cluster.length
      };
    });
  }

  private converged(oldCentroids: Point[], newCentroids: Point[], tolerance: number): boolean {
    return oldCentroids.every((old, idx) => {
      return this.euclideanDistance(old, newCentroids[idx]) <= tolerance;
    });
  }

  private euclideanDistance(a: Point, b: Point): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
}
