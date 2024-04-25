import {Component, ElementRef, input, OnDestroy, OnInit, viewChild} from "@angular/core";
import {Chart, ChartData, ChartOptions} from "chart.js/auto";
import {ChartDef} from "./line-chart";
import {Subscription} from "rxjs";

@Component({
  selector: "app-line-chart",
  imports: [],
  templateUrl: "./line-chart.component.html",
  styleUrl: "./line-chart.component.scss"
})
export class LineChartComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  view = viewChild.required<ElementRef>("chart");
  _chart: Chart;
  chartDef = input.required<ChartDef>();

  ngOnInit(): void {
    this.initChart();
    this.sub.add(this.obData());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  obData() {
    return this.chartDef().obData().subscribe({
      next: data => {
        const chartData = this._chart.data;
        chartData.datasets[0].data = data.map(d => d.y);
        chartData.labels =  data.map(d => d.x);
        this._chart.update();
      }
    });
  }

  initChart(): void {
    this._chart = new Chart(
      this.view().nativeElement,
      {
        type: "line",
        data: this.chartData(),
        options: this.chartOptions()
      }
    );
  }

  chartData(): ChartData {
    return {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: "red",
        fill: false
      }]
    };
  }

  chartOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {display: false},
        title: {
          display: true,
          text: this.chartDef().name
        }
      }
    };
  }
}
