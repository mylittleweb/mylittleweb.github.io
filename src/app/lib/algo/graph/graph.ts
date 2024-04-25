import _ from "lodash";

export interface Graph {
  addNode(node: GraphNode): boolean;
  addEdge(edge: GraphEdge): boolean;

  getNode(id: string): GraphNode | undefined;
  nodes(): GraphNode[];

  edges(node: GraphNode): GraphEdge[];
  allEdges(): GraphEdge[];

  resetState(): void;
}

export class UndirectedGraph implements Graph {
  private _nodes = new Map<string, GraphNode>();
  private _edges = new Map<string, Map<string, GraphEdge>>();

  static Generate(nodes: number, edges: number) {
    const g = new UndirectedGraph();
    for (let i = 0; i < nodes; i++) {
      g.addNode({
        id: "" + i, value: i
      });
    }

    let addedEdges = 0;
    while (addedEdges < edges) {
      let [from, to] = [_.random(0, nodes - 1), _.random(0, nodes - 1)];
      if (from === to) {
        continue;
      }

      // keep the id consistent
      if (from > to) {
        [from, to] = [to, from];
      }
      const edge = {
        id: `${from}<->${to}`, source: "" + from, target: "" + to, weight: _.random(1, 30),
        state: GraphEdgeState.None
      };
      addedEdges = addedEdges + (g.addEdge(edge) ? 1 : 0);
    }
    return g;
  }

  constructor() {}

  addNode(node: GraphNode): boolean {
    const isNewNode = this._nodes.has(node.id);

    this._nodes.set(node.id, node);
    if (!this._edges.has(node.id)) {
      this._edges.set(node.id, new Map<string, GraphEdge>);
    }
    return isNewNode;
  }

  getNode(id: string): GraphNode | undefined {
    return this._nodes.get(id);
  }

  addEdge(edge: GraphEdge): boolean {
    if (!this._edges.has(edge.source)) {
      this._edges.set(edge.source, new Map<string, GraphEdge>);
    }
    if (!this._edges.has(edge.target)) {
      this._edges.set(edge.target, new Map<string, GraphEdge>);
    }

    const isNewEdge = !this._edges.get(edge.source)?.has(edge.target);
    this._edges.get(edge.source)?.set(edge.target, {
      ...edge,
      source: edge.source,
      target: edge.target
    });
    this._edges.get(edge.target)?.set(edge.source, {
      ...edge,
      source: edge.target,
      target: edge.source
    });

    return isNewEdge;
  }

  nodes(): GraphNode[] {
    return [...this._nodes.values()];
  }

  allEdges(): GraphEdge[] {
    const addedEdge = new Set<string>([]);
    const edges: GraphEdge[] = [];
    for (const node of this.nodes()) {
      for (const edge of this.edges(node)) {
        if (!addedEdge.has(edge.id)) {
          edges.push(edge);
          addedEdge.add(edge.id);
        }
      }
    }
    return edges;
  }

  edges(node: GraphNode | undefined): GraphEdge[] {
    if (!node) {
      return [];
    }
    const edges = this._edges.get(node.id);
    return Array.from(edges ? edges.values() : []);
  }

  resetState(): void {
    for (const row of this._edges.values()) {
      for (const edge of row.values()) {
        edge.state = GraphEdgeState.None;
      }
    }
  }
}

export type GraphNode = {
  id: string;
  value: number;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  weight: number;
  state: GraphEdgeState;
};

export enum GraphEdgeState {
  None,
  Visited,
  Selected
}
