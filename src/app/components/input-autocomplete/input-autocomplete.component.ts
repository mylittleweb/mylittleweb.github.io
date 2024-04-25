import {AsyncPipe} from "@angular/common";
import {Component, model, OnInit, input} from "@angular/core";
import {ReactiveFormsModule, FormControl} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormField, MatInputModule} from "@angular/material/input";
import {Observable, startWith, map, tap} from "rxjs";

@Component({
  selector: "app-input-autocomplete",
  imports: [
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    AsyncPipe,
    MatFormField
  ],
  templateUrl: "./input-autocomplete.component.html",
  styleUrl: "./input-autocomplete.component.scss"
})
export class InputAutocompleteComponent implements OnInit {
  inputField = new FormControl("");

  selectedValue = model<string>("");

  label = input.required<string>();

  values = input.required<string[]>();

  filteredValues: Observable<string[]>;

  ngOnInit(): void {
    this.initFilter();
  }

  initFilter() {
    this.filteredValues = this.inputField.valueChanges.pipe(
      startWith(""),
      tap((v) => {
        if (v === null || v === "") {
          this.selectedValue.set("");
        }
      }),
      map((v) => {
        return this.values().filter(value => value.toLowerCase().includes(v ?? ""));
      })
    );
  }
}
