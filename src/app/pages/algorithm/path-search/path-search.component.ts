import {Component, OnDestroy, OnInit, signal} from "@angular/core";
import {Map} from "../map/map";
import {Subscription, tap} from "rxjs";
import {MapService} from "../map/map.service";
import {Result, PathSearchAlgorithms} from "./path-search";

@Component({
  selector: "app-breadth-first-search",
  templateUrl: "./path-search.component.html",
  styleUrl: "./path-search.component.scss",
  standalone: false,
  providers: [
    MapService
  ]
})
export class PathSearchComponent implements OnInit, OnDestroy {
  subscription = new Subscription();

  problem = signal<Map | undefined>(undefined);

  selectedAlgorithm = signal<string>("");

  result = signal<Result>({solution: undefined,
    steps: [],
    name: "",
    expanded: 0,
    pending: 0});

  solving = signal<boolean>(false);

  constructor(private readonly mapSvc: MapService) {}

  ngOnInit(): void {
    this.subscription.add(this.observeProblem());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  observeProblem() {
    return this.mapSvc.mapObservable.pipe(
      tap(p => {
        this.problem.set(p);
        this.result.set({solution: undefined,
          steps: [],
          name: "",
          expanded: 0,
          pending: 0});
      })
    ).subscribe();
  }

  solve() {
    this.solving.set(true);
    // using setTimeout to not block main thread
    setTimeout(() => {
      const algo = PathSearchAlgorithms[this.selectedAlgorithm()];
      const p = this.problem();
      if (algo && p) {
        p.reset();
        this.result.set(algo(p).run());
      }
      this.solving.set(false);
    }, 2);
  }

  algorithmNames(): string[] {
    return Object.keys(PathSearchAlgorithms);
  }
}
