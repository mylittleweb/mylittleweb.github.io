import {Component, input} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {TextField} from "../form-field";

@Component({
  selector: "app-form-field-text",
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput
  ],
  templateUrl: "./form-field-text.component.html",
  styleUrl: "./form-field-text.component.scss"
})
export class FormFieldTextComponent {
  field = input.required<TextField>();

}
