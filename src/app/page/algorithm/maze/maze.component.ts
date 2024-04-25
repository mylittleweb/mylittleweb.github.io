import {Component, OnDestroy, OnInit, signal} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Cell, Grid, Maze, MazeGeneratorBuilder, MazeGenerators} from "../../../lib/maze/maze";
import {BehaviorSubject, concatMap, delay, from, of, Subscription, switchMap, tap} from "rxjs";

@Component({
  selector: "app-maze",
  templateUrl: "./maze.component.html",
  styleUrl: "./maze.component.scss",
  standalone: false
})
export class MazeComponent implements OnInit, OnDestroy {
  mazeConfigForm: FormGroup;

  grid = signal<Grid>([[]]);

  sub = new Subscription();

  generatorName = signal<string[]>(Object.keys(MazeGenerators));

  generating = signal<boolean>(false);

  generationSteps = new BehaviorSubject<Grid[]>([]);

  constructor(private fb: FormBuilder) {
    this.mazeConfigForm = this.fb.group({
      columns: [30, [Validators.required]],
      rows: [30, [Validators.required]],
      generator: ["Binary", [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.sub.add(this.generationSteps.pipe(
      switchMap(steps => {
        return from(steps || []).pipe(
          concatMap((step) => {
            return of(step).pipe(
              delay(1),
              tap(s => {
                this.grid.set(s);
              })
            );
          })
        );
      })
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  generate() {
    if (this.mazeConfigForm.valid) {
      const maze = new Maze(this.mazeConfigForm.value);
      this.generationSteps.next([maze.cloneGrid()]);
      this.generating.set(true);
      setTimeout(() => {
        // @ts-expect-error suppress type warning
        const generator: MazeGeneratorBuilder = MazeGenerators[this.mazeConfigForm.value.generator];
        if (generator !== undefined) {
          const steps = generator(maze).generate().steps;
          this.generationSteps.next(steps);
        }
        this.generating.set(false);
      }, 1);
    }
  }

  cellStyle(cell: Cell) {
    return {
      unknown: !cell.visited,
      "wall-north": cell.wall.north,
      "wall-east": cell.wall.east,
      "wall-south": cell.wall.south,
      "wall-west": cell.wall.west
    };
  }
}
