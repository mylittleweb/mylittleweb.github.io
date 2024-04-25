import {Component, OnInit} from "@angular/core";
import {Css} from "cytoscape";
import {DagreLayoutOptions} from "cytoscape-dagre";
import {Value} from "../../../lib/algo/autodiff";
import {BehaviorSubject, filter, interval, switchMap, take, takeWhile, tap} from "rxjs";
import {Form} from "../../../component/form/form";
import {FormFields} from "../../../component/form/form-field";
import {FormControl, Validators} from "@angular/forms";
import {FormFieldComponent} from "../../../component/form/form-field/form-field.component";
import {MatButton} from "@angular/material/button";
import {ChartDef} from "../../../component/graph/line-chart/line-chart";
import {LineChartComponent} from "../../../component/graph/line-chart/line-chart.component";
import {GraphComponent} from "../../../component/graph/graph/graph.component";
import {GraphDef, GraphDataDef} from "../../../component/graph/graph/graph";

type FormConfig = {
  iteration: number;
  learningRate: number;
  threshold: number;
};

@Component({
  selector: "app-auto-diff",
  imports: [
    FormFieldComponent,
    MatButton,
    LineChartComponent,
    GraphComponent
  ],
  templateUrl: "./auto-diff.component.html",
  styleUrl: "./auto-diff.component.scss"
})
export class AutoDiffComponent implements OnInit {

  w1: Value; x1: Value; w1x1: Value;
  w2: Value; x2: Value; w2x2: Value;
  bias: Value;
  w1x1w2x2: Value;
  prediction: Value; target: Value; error: Value;

  _train = new BehaviorSubject<boolean>(false);

  statCharts: {
    w1: ChartDef; w2: ChartDef; bias: ChartDef; "error = target - prediction": ChartDef;
    [k: string]: ChartDef;
  };

  form = new Form([
    FormFields.number("iteration", "Iteration", new FormControl(10, [Validators.required, Validators.min(1)])),
    FormFields.number("learningRate", "Learning Rate", new FormControl(0.01, [Validators.required, Validators.min(0.0001)])),
    FormFields.number("threshold", "Threshold", new FormControl("0.001", [Validators.required, Validators.min(0.0001)]))
  ]);

  _totalIteration = 0;

  graphDef: GraphDef;

  constructor() {
    this.initNeuron(-3, 1, 6.88);
    this.graphDef = new GraphDef(
      "error = target - ((w1 * x1) + (w2 * x2) + bias)",
      {
        "text-wrap": "wrap",
        label: (node: any) => {
          return `${node.data("id")}\ndata: ${node.data("value").data }\ngrad: ${node.data("value").grad}`;
        }
      } as Css.Node,
      {
        width: 4,
        "target-arrow-shape": "triangle",
        "line-color": "#9dbaea",
        "target-arrow-color": "#9dbaea",
        "curve-style": "bezier"
      } as Css.Edge,
      {
        name: "dagre",
        // rankDir: "LR",
        nodeSep: 300,
        minLen: () => 1
      } as DagreLayoutOptions
    );
    this.graphDef.setData(this.collectData());
  }

  ngOnInit() {
    this.initStatGraphCharts();
    this.obTrainRequest();
  }

  train() {
    this._train.next(true);
  }

  obTrainRequest() {
    return this._train.pipe(
      filter((t) => t),
      switchMap(() => {
        const config = this.form.group().value as FormConfig;
        return interval(1000).pipe(
          take(config.iteration),
          takeWhile(() => this.error.data <= config.threshold),
          tap(() => {
            this._totalIteration += 1;
          }),
          tap(() => {
            this.w1.data -= this.w1.grad * config.learningRate;
            this.w2.data -= this.w2.grad * config.learningRate;
            this.bias.data -= this.bias.grad * config.learningRate;
            this.error.forward();

            this.error.zero_grad();
            this.error.backward();
          }),
          tap(() => {
            this.graphDef.setData(this.collectData());
          }),
          tap(() => {
            [this.w1, this.w2, this.bias, this.error].forEach(v => {
              const c = this.statCharts[v.label];
              c.addData([{
                x: this._totalIteration,
                y: v.data
              }]);
            });
          })
        );
      })
    ).subscribe();
  }

  initNeuron(w1: number, w2: number, bias: number) {
    this.w1 = new Value(w1); this.w1.label = "w1";
    this.x1 = new Value(2); this.x1.label = "x1";
    this.w1x1 = this.w1.mul(this.x1); this.w1x1.label = "a = w1 * x1";

    this.w2 = new Value(w2); this.w2.label = "w2";
    this.x2 = new Value(0); this.x2.label = "x2";
    this.w2x2 = this.w2.mul(this.x2); this.w2x2.label = "b = w2 * x2";

    this.w1x1w2x2 = this.w1x1.add(this.w2x2); this.w1x1w2x2.label = "c = w1x1 + w2x2";

    this.bias = new Value(bias); this.bias.label = "bias";
    this.prediction = this.w1x1w2x2.add(this.bias); this.prediction.label = "prediction = c + bias";
    this.target = new Value(0); this.target.label = "target";
    this.error = this.target.sub(this.prediction); this.error.label = "error = target - prediction";
  }

  collectData(): GraphDataDef {
    const nodes = [];
    const edges = [];

    const stack = [this.error];
    while (stack.length > 0) {
      const n = stack.pop() as Value;
      nodes.push({data: {id: n?.label, value: n}});
      const child = n?.children || [];
      for (const c of child) {
        edges.push({data: {source: c.label, target: n.label}});
        stack.push(c);
      }
    }

    return {
      action: "init",
      nodes: nodes,
      edges: edges
    };
  }

  initStatGraphCharts() {
    this.statCharts = {
      w1: this.statChart(this.w1),
      w2: this.statChart(this.w2),
      bias: this.statChart(this.bias),
      "error = target - prediction": this.statChart(this.error)
    };
  }

  statChart(v: Value) {
    const c = new ChartDef(v.label);
    c.addData([{
      x: this._totalIteration,
      y: v.data
    }]);
    return c;
  }
}
