import {AsyncPipe, JsonPipe} from "@angular/common";
import {Component, OnInit, OnDestroy} from "@angular/core";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormFields} from "../../../component/form/form-field";
import {Form} from "../../../component/form/form";
import {FormFieldComponent} from "../../../component/form/form-field/form-field.component";

@Component({
  selector: "app-form-example",
  imports: [
    AsyncPipe,
    JsonPipe,
    FormFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: "./form-example.component.html",
  styleUrl: "./form-example.component.scss"
})
export class FormExampleComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  form = new Form([
    FormFields.text("text", "Text", new FormControl("", [Validators.required])),
    FormFields.number("number", "Number", new FormControl("", [])),
    FormFields.select("select", "Select", new FormControl(""),
      new BehaviorSubject([
        {label: "a", value: {data: "foo"}},
        {label: "b", value: {data: "bar"}}
      ])
    ),
    FormFields.autocomplete("autocomplete", "Auto Complete", new FormControl(""),
      new BehaviorSubject(["foo", "bar", "hello"])
    )
  ]);

  ngOnInit() {
    this.form.valueChanges().subscribe({
      next: console.log
    });
  }

  ngOnDestroy() {
  }
}
