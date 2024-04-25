import {Component, ElementRef, input, OnDestroy, OnInit, viewChild} from "@angular/core";
import {Subscription} from "rxjs";
import {GraphDef} from "./graph";

import cytoscape, {Css} from "cytoscape";
import dagre, {DagreLayoutOptions} from "cytoscape-dagre";
cytoscape.use(dagre);


@Component({
  selector: "app-dagre-graph",
  imports: [],
  templateUrl: "./dagre-graph.component.html",
  styleUrl: "./dagre-graph.component.scss"
})
export class DagreGraphComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  cy: cytoscape.Core;
  canvas = viewChild.required<ElementRef>("canvas");
  graphDef = input.required<GraphDef>();


  ngOnInit() {
    this.initGraph();
    this.obData();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  obData() {
    return this.graphDef().obData().subscribe({
      next: data => {
        console.log(data);
        this.cy.elements().remove();
        this.cy.add(data);
        this.cy.layout(this.graphLayout()).run();
      }
    });
  }

  initGraph() {
    this.cy = cytoscape({
      container: this.canvas().nativeElement,

      boxSelectionEnabled: false,
      autounselectify: true,

      layout: this.graphLayout(),
      elements: {nodes: [], edges: []},
      style: [
        {selector: "node", style: this.graphNodeStyle()},
        {selector: "edge", style: this.graphEdgeStyle()}
      ]
    });
  }

  graphLayout() {
    return {
      name: "dagre",
      // rankDir: "LR",
      nodeSep: 300,
      minLen: () => 1
    } as DagreLayoutOptions;
  }

  graphNodeStyle() {
    return {
      "text-wrap": "wrap",
      label: this.graphDef().label
    } as Css.Node;
  }

  graphEdgeStyle() {
    return {
      width: 4,
      "target-arrow-shape": "triangle",
      "line-color": "#9dbaea",
      "target-arrow-color": "#9dbaea",
      "curve-style": "bezier"
    } as Css.Edge;
  }
}
