import {Chart} from "chart.js/auto";
import {ElementRef} from "@angular/core";
import {colors} from "../../../lib/color";

export type City = {
  x: number;
  y: number;
};

export class TspGraph {
  _chart: Chart;
  ready = false;

  constructor(view: ElementRef) {
    this._chart = this.initChart(view);

  }

  setPath(path: City[]) {
    this._chart.data.datasets[1] = {
      label: "path",
      data: path,
      borderColor: colors[1],
      showLine: true,
      fill: false
    };
    this._chart.update();
  }

  setCities(cities: City[]) {
    this._chart.data = {
      datasets: [{
        label: "cities",
        data: cities,
        backgroundColor: colors[0],
        pointRadius: 5
      }]
    };
    this._chart.update();
    this.ready = true;
  }

  initChart(view: ElementRef): Chart {
    return new Chart(
      view.nativeElement,
      {
        type: "scatter",
        data: {
          datasets: []
        },
        options: {
          animation: false
        }
      }
    );
  }
}
