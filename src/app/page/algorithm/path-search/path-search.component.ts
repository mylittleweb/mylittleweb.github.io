import {Component, OnDestroy, OnInit, signal} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {FormFields} from "../../../component/form/form-field";
import {Map} from "../../../lib/map/map";
import {Subscription, of} from "rxjs";
import {Result, PathSearchAlgorithms} from "../../../lib/algo/path-search/path-search";

@Component({
  selector: "app-breadth-first-search",
  templateUrl: "./path-search.component.html",
  styleUrl: "./path-search.component.scss",
  standalone: false,
  providers: []
})
export class PathSearchComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  map = signal<Map | undefined>(undefined);

  selectedAlgo = FormFields.select("algorithm", "Algorithm", new FormControl(undefined, [Validators.required]),
    of(Object.keys(PathSearchAlgorithms).map(name => {
      return {label: name, value: PathSearchAlgorithms[name]};
    }))
  );

  solving = signal<boolean>(false);
  result = signal<Result>({
    name: "", solution: undefined,
    steps: [], expanded: 0, pending: 0
  });

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  run() {
    this.solving.set(true);

    setTimeout(() => {
      const algo = this.selectedAlgo.formControl.value;
      const map = this.map() as Map;
      if (algo && map) {
        map.reset();
        this.result.set(algo(map).run());
      }

      this.solving.set(false);
    }, 1);
  }

  onNewMap(map: Map) {
    this.map.set(map);
    this.result.set({solution: undefined,
      steps: [map.cloneGrid()],
      name: "",
      expanded: 0,
      pending: 0});
  }
}
