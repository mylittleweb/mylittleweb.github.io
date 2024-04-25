import {Component, OnInit, OnDestroy} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {Css} from "cytoscape";
import {FcoseLayoutOptions} from "cytoscape-fcose";
import {BehaviorSubject, Subscription, switchMap, concatMap, from, of, delay, tap} from "rxjs";
import {Form} from "../../../component/form/form";
import {FormFields} from "../../../component/form/form-field";
import {GraphDef} from "../../../component/graph/graph/graph";
import {GraphEdgeState, UndirectedGraph} from "../../../lib/algo/graph/graph";
import {Kruskal, MST, MSTStep, Prim} from "../../../lib/algo/graph/mst";

@Component({
  selector: "app-minimum-spanning-tree",
  templateUrl: "./minimum-spanning-tree.component.html",
  styleUrl: "./minimum-spanning-tree.component.scss",
  standalone: false
})
export class MinimumSpanningTreeComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  algoForm = new Form([
    FormFields.select("algo", "Algorithm", new FormControl("Kruskal", [Validators.required]),
      new BehaviorSubject([
        {label: "Kruskal", value: "Kruskal"},
        {label: "Prim", value: "Prim"}
      ])
    )
  ]);

  graphForm = new Form([
    FormFields.number("nodes", "Nodes", new FormControl(10, [Validators.required, Validators.min(1)])),
    FormFields.number("edges", "Edges", new FormControl(20, [Validators.required, Validators.min(0)]))
  ]);
  graphDef = new GraphDef("",
    {
      "text-wrap": "wrap",
      "text-halign": "center",
      "text-valign": "center",
      label: (node: any) => `${node.data("id")}`
    } as Css.Node,
    {
      width: 4,
      // "target-arrow-shape": "triangle",
      "line-color": (edge) => {
        const state = edge.data("state") as GraphEdgeState;
        switch (state) {
          case GraphEdgeState.Selected:
            return "red";
          case GraphEdgeState.Visited:
            return "lightgrey";
          default:
            return "#9dbaea";
        }
      },
      "target-arrow-color": "#9dbaea",
      "curve-style": "bezier",
      "z-index": (edge) => edge.data("selected") ? 2 : 1,
      label: (edge: any) => `${edge.data("weight")}`
    } as Css.Edge,
    {
      name: "fcose",
      quality: "default",
      // randomize: false,
      animate: true,
      animationDuration: 1,
      idealEdgeLength: (edge) => {
        return edge.data("weight") * 15;
      }
      // nodeSeparation: 5000
    } as FcoseLayoutOptions
  );
  graph: UndirectedGraph;

  steps = new BehaviorSubject<MSTStep[]>([]);

  ngOnInit() {
    this.sub.add(this.steps.pipe(
      switchMap(steps => {
        return from(steps).pipe(
          concatMap(step => {
            return of(step).pipe(
              delay(100),
              tap(step => {
                this.graphDef.setData({
                  action: "update",
                  nodes: this.graph.nodes().map(n => {
                    return {data: n};
                  }),
                  edges: step.map(e => {
                    return {data: e};
                  })
                });
              })
            );
          })
        );
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  generateGraph() {
    const formData = this.graphForm.group().value as GraphFormData;
    this.graph = UndirectedGraph.Generate(formData.nodes, formData.edges);
    this.resetGraph("init");
  }

  generateMST() {
    const algoName = this.algoForm.control("algo")?.value;
    let algo: MST;
    switch (algoName) {
      case "Kruskal":
        algo = new Kruskal(); break;
      case "Prim":
        algo = new Prim(); break;
      default:
        console.error("unknown MST algo: " + algoName);
        return;
    }

    this.graph.resetState();
    this.resetGraph("update");
    const steps = algo.run(this.graph);
    this.steps.next(steps);
  }

  resetGraph(action: "init" | "update") {
    this.graphDef.setData({
      action: action,
      nodes: this.graph.nodes().map(n => {
        return {data: n};
      }),
      edges: this.graph.allEdges().map(e => {
        return {data: e};
      })
    });
  }
}

type GraphFormData = {
  nodes: number;
  edges: number;
};
