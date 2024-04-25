import {ElementRef} from "@angular/core";
import {Chart, LegendItem} from "chart.js/auto";
import {colors} from "../../../lib/color";
import {Step} from "../../../lib/algo/k-mean-clustering";

export class KMeanScatterChart {
  _chart: Chart;

  constructor(view: ElementRef) {
    this._chart = this.initChart(view);
  }

  setSource(data: any) {
    this._chart.data = {
      datasets: [{
        label: "source",
        data: data,
        backgroundColor: colors[0]
      }]
    };
    this._chart.update();
  }

  renderStep(step: Step) {
    const datasets = [];
    for (let i = 0; i < step.centroids.length; i++) {
      datasets.push({
        label: `centroid ${i}`,
        data: [step.centroids[i]],
        backgroundColor: colors[i + 1],
        borderColor: colors[0],
        borderWidth: 3,
        pointRadius: 5
      });

      datasets.push({
        label: `cluster ${i}`,
        data: step.clusters[i],
        borderColor: colors[i + 1],
        backgroundColor: colors[i + 1]
      });
    }
    this._chart.data.datasets = datasets;
    this._chart.update();
  }

  initChart(view: ElementRef): Chart {
    return new Chart(
      view.nativeElement,
      {
        type: "scatter",
        data: {
          datasets: [{
            label: "source", data: [], backgroundColor: colors[0]
          }]
        },
        options: {
          animation: false,
          plugins: {
            legend: {
              labels: {
                filter: (item: LegendItem): boolean => {
                  return !item.text.includes("centroid");
                }
              }
            }
          }
        }
      }
    );
  }
}
