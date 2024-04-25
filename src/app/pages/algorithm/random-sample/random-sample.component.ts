import {Component, viewChild, ElementRef, signal, OnInit, OnDestroy} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {Chart} from "chart.js/auto";
import {from, concatMap, of, delay, tap, Subscription, BehaviorSubject, switchMap} from "rxjs";
import {RandomSampleAlgorithms} from "./random-sample";
import * as _ from "lodash";

@Component({
  selector: "app-random-sample",
  templateUrl: "./random-sample.component.html",
  styleUrl: "./random-sample.component.scss",
  standalone: false
})
export class RandomSampleComponent implements OnInit, OnDestroy {
  chart: Chart;

  chartCanvas = viewChild.required<ElementRef>("randomSampleCanvas");

  totalSamples = new FormControl(
    1000000,
    [Validators.required, Validators.min(1), Validators.max(1000000)]
  );

  algorithmNames = signal<string[]>(Object.keys(RandomSampleAlgorithms));

  selectedAlgorithm = signal<string>("");

  configuredAlgorithm = signal<(() => number) | undefined>(undefined);

  samplesObservable = new BehaviorSubject<number[]>([]);

  subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(this.observeSamples());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  generate() {
    const f = this.configuredAlgorithm();
    if (f === undefined || this.totalSamples.invalid || this.totalSamples.value === null) {
      return;
    }
    const samples: number[] = [];
    while (samples.length < this.totalSamples.value) {
      samples.push(f());
    }
    this.samplesObservable.next(samples);
  }

  updateChart(hist: number[], samples: number[]) {
    for (const s of samples) {
      hist[s] = hist[s] ? hist[s] + 1 : 1;
    }
    const indexes = [...Array(hist.length).keys()];
    this.chart.data.labels = indexes;
    this.chart.data.datasets[0].data = indexes.map(i => hist[i] ?? 0);
    this.chart.update();
  }

  observeSamples() {
    return this.samplesObservable.pipe(
      switchMap(samples => {
        this.resetChart();
        const hist: number[] = [];
        return from(_.chunk(samples, Math.ceil(samples.length / 100))).pipe(
          concatMap(samples => {
            return of(samples).pipe(
              delay(0),
              tap(samples => {
                this.updateChart(hist, samples);
              })
            );
          })
        );
      })
    ).subscribe();
  }

  resetChart() {
    if (this.chart !== undefined) {
      this.chart.destroy();
    }

    this.chart = new Chart(
      this.chartCanvas().nativeElement,
      {
        type: "bar",
        data: {
          labels: [],
          datasets: [{data: []}]
        },
        options: {
          indexAxis: this.selectedAlgorithm() === "Bernoulli" ? "y" : "x",
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {display: false}
          }
        }
      }
    );
    this.chart.render();
  }
}
