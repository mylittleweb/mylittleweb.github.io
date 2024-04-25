import {Component, viewChild, ElementRef, signal, OnInit, OnDestroy} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {Chart} from "chart.js/auto";
import {from, of, delay, tap, Subscription, BehaviorSubject, switchMap, concatMap} from "rxjs";
import {RandomSampleAlgorithms} from "../../../lib/algo/random-sample/random-sample";
import {chunk} from "lodash";

@Component({
  selector: "app-random-sample",
  templateUrl: "./random-sample.component.html",
  styleUrl: "./random-sample.component.scss",
  standalone: false
})
export class RandomSampleComponent implements OnInit, OnDestroy {
  subscription = new Subscription();

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
        return of(chunk(samples, Math.ceil(samples.length / 100)));
      }),
      switchMap((chunks) => {
        const hist: number[] = [];
        return from(chunks).pipe(
          concatMap(chunk => {
            return of(chunk).pipe(
              delay(10),
              tap(() => {
                this.updateChart(hist, chunk);
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
