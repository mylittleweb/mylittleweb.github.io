import {AsyncPipe} from "@angular/common";
import {Component, input, OnInit, OnDestroy} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Subscription, startWith, map, take, BehaviorSubject, switchMap, debounceTime} from "rxjs";
import {AutoCompleteField} from "../form-field";

@Component({
  selector: "app-form-field-autocomplete",
  imports: [
    MatFormFieldModule,
    MatInput,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: "./form-field-autocomplete.component.html",
  styleUrl: "./form-field-autocomplete.component.scss"
})
export class FormFieldAutocompleteComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  field = input.required<AutoCompleteField>();

  filteredOptions = new BehaviorSubject<string[]>([]);

  ngOnInit() {
    this.sub.add(this.field().formControl.valueChanges.pipe(
      startWith(""),
      debounceTime(150),
      switchMap((value: string) => {
        return this.field().options.pipe(
          take(1),
          map((options) => {
            const filterValue = value.toLowerCase();
            return options.filter(option => option.toLowerCase().includes(filterValue));
          })
        );
      })
    ).subscribe({
      next: (options) => this.filteredOptions.next(options)
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
