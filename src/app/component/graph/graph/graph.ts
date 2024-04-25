import {EdgeDefinition, NodeDefinition, Css, LayoutOptions} from "cytoscape";
import {BehaviorSubject} from "rxjs";

export type GraphDataDef = {
  action: "init" | "update";
  nodes: NodeDefinition[];
  edges: EdgeDefinition[];
};

export class GraphDef {
  private _data = new BehaviorSubject<GraphDataDef>({action: "init", nodes: [], edges: []});

  constructor(
    public name: string,
    public nodeStyle: Css.Node,
    public edgeStyle: Css.Edge,
    public layout: LayoutOptions
  ) {}

  setData(data: GraphDataDef) {
    this._data.next(data);
  }

  obData() {
    return this._data;
  }
}
