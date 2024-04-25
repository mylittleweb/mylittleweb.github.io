import {Component, input} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

import {NumberField} from "../form-field";

@Component({
  selector: "app-form-field-number",
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput
  ],
  templateUrl: "./form-field-number.component.html",
  styleUrl: "./form-field-number.component.scss"
})
export class FormFieldNumberComponent {
  field = input.required<NumberField>();
}
