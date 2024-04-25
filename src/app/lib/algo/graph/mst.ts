import {GraphEdge, GraphEdgeState, GraphNode, UndirectedGraph} from "./graph";
import {UnionFind} from "./union-find";
import _ from "lodash";
import {PriorityQueue} from "@datastructures-js/priority-queue";

export type MSTStep = GraphEdge[];

export interface MST {
  run(g: UndirectedGraph): MSTStep[];
}

export class Kruskal implements MST {
  run(g: UndirectedGraph) {
    const steps: MSTStep[] = [];

    const edges = g.allEdges();
    edges.sort((a, b) => a.weight - b.weight);
    edges.forEach( e => e.state = GraphEdgeState.Visited);
    steps.push(_.cloneDeep(edges));

    const unionFind = new UnionFind(g.nodes().length);

    for (const edge of edges) {
      if (unionFind.union(Number(edge.source), Number(edge.target))) {
        edge.state = GraphEdgeState.Selected;
        steps.push([_.cloneDeep(edge)]);
      }
    }

    return steps;
  }
}

export class Prim implements MST {
  run(g: UndirectedGraph) {
    const steps: MSTStep[] = [];

    const nodes = g.nodes();
    if (nodes.length === 0) {
      return steps;
    }

    const coveredNodes = new Set<string>([]);
    for (const node of nodes) {
      if (!coveredNodes.has(node.id)) {
        coveredNodes.add(node.id);
        steps.push(...this._run(node, g, coveredNodes));
      }
    }

    return steps;
  }

  private _run(node: GraphNode, g: UndirectedGraph, coveredNodes: Set<string>): MSTStep[] {
    const steps: MSTStep[] = [];

    const edgePQ = new PriorityQueue<GraphEdge>((a, b) => a.weight - b.weight);
    this.collectEdges(node, g, coveredNodes, edgePQ, steps);

    while (edgePQ.size() > 0) {
      const minEdge = edgePQ.pop();
      if (minEdge && !coveredNodes.has(minEdge.target)) {
        minEdge.state = GraphEdgeState.Selected;
        coveredNodes.add(minEdge.target);
        steps.push([_.cloneDeep(minEdge)]);

        this.collectEdges(g.getNode(minEdge.target), g, coveredNodes, edgePQ, steps);

      }
    }
    return steps;
  }

  private collectEdges(node: GraphNode | undefined, g: UndirectedGraph, visited: Set<string>, pq: PriorityQueue<GraphEdge>, steps: MSTStep[]) {
    for (const edge of g.edges(node)) {
      if (!visited.has(edge.target)) {
        edge.state = GraphEdgeState.Visited;
        pq.push(edge);
        steps.push([_.cloneDeep(edge)]);
      }
    }
  }
}
