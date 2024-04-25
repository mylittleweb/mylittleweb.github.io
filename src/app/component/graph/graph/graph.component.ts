import {Component, ElementRef, input, OnDestroy, OnInit, viewChild} from "@angular/core";
import {Subscription} from "rxjs";
import {GraphDef} from "./graph";

import cytoscape, {NodeDefinition, EdgeDefinition} from "cytoscape";
import dagre from "cytoscape-dagre";
import fcose from "cytoscape-fcose";
cytoscape.use(dagre);
cytoscape.use(fcose);


@Component({
  selector: "app-graph",
  imports: [],
  templateUrl: "./graph.component.html",
  styleUrl: "./graph.component.scss"
})
export class GraphComponent implements OnInit, OnDestroy {
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
        if (data.action === "init") {
          this.cy.elements().remove();
          this.cy.add(data);
          this.cy.layout(this.graphDef().layout).run();
        } else {
          this.updateNodes(data.nodes);
          this.updateEdges(data.edges);
        }
      }
    });
  }

  initGraph() {
    this.cy = cytoscape({
      container: this.canvas().nativeElement,

      boxSelectionEnabled: false,
      autounselectify: true,

      layout: this.graphDef().layout,
      elements: {nodes: [], edges: []},
      style: [
        {selector: "node", style: this.graphDef().nodeStyle},
        {selector: "edge", style: this.graphDef().edgeStyle}
      ]
    });
  }

  updateNodes(nodes: NodeDefinition[]) {
    nodes.forEach(node => {
      const n = this.cy.getElementById(node.data.id as string);
      if (n) {
        n.data(node.data);
        n.style(this.graphDef().nodeStyle);
      }
    });
  }

  updateEdges(edges: EdgeDefinition[]) {
    edges.forEach(edge => {
      const e = this.cy.getElementById(edge.data.id as string);
      if (e) {
        e.data(edge.data);
        e.style(this.graphDef().edgeStyle);
      }
    });
  }
}
