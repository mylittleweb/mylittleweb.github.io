export class UnionFind {
  private parent: number[];
  private height: number[];

  constructor(size: number) {
    this.parent = Array.from({length: size}, (_, i) => i);
    this.height = Array(size).fill(0);
  }

  find(node: number): number {
    if (this.parent[node] !== node) {
      this.parent[node] = this.find(this.parent[node]); // path compression
    }
    return this.parent[node];
  }

  union(node1: number, node2: number): boolean {
    const root1 = this.find(node1);
    const root2 = this.find(node2);

    if (root1 === root2) {
      // already connected
      return false;
    }

    if (this.height[root1] > this.height[root2]) {
      this.parent[root2] = root1;
    } else if (this.height[root1] < this.height[root2]) {
      this.parent[root1] = root2;
    } else {
      this.parent[root2] = root1;
      this.height[root1] += 1;
    }

    return true;
  }
}
