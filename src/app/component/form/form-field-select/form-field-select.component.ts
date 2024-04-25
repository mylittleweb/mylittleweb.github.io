import {AsyncPipe} from "@angular/common";
import {Component, input} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";

import {SelectField} from "../form-field";

@Component({
  selector: "app-form-field-select",
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: "./form-field-select.component.html",
  styleUrl: "./form-field-select.component.scss"
})
export class FormFieldSelectComponent {
  field = input.required<SelectField>();
}
