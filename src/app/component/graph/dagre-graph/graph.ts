import {EdgeDefinition, NodeDefinition} from "cytoscape";
import {BehaviorSubject} from "rxjs";

export type GraphDataDef = {
  nodes: NodeDefinition[];
  edges: EdgeDefinition[];
};

export class GraphDef {
  private _data = new BehaviorSubject<GraphDataDef>({nodes: [], edges: []});

  constructor(public name: string, public label: (node: any) => string) {
  }

  setData(data: GraphDataDef) {
    this._data.next(data);
  }

  obData() {
    return this._data;
  }
}
