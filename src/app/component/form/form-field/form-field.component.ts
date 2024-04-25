import {
  Component,
  viewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  input,
  Type
} from "@angular/core";
import {FormField, FormFieldType} from "../form-field";
import {FormFieldAutocompleteComponent} from "../form-field-autocomplete/form-field-autocomplete.component";
import {FormFieldNumberComponent} from "../form-field-number/form-field-number.component";
import {FormFieldSelectComponent} from "../form-field-select/form-field-select.component";
import {FormFieldTextComponent} from "../form-field-text/form-field-text.component";

@Component({
  selector: "app-form-field",
  imports: [],
  templateUrl: "./form-field.component.html",
  styleUrl: "./form-field.component.scss"
})
export class FormFieldComponent implements OnInit, OnDestroy {
  field = input.required<FormField>();

  view = viewChild.required("container", {read: ViewContainerRef});

  private fields: Record<FormFieldType, Type<unknown>> = {
    text: FormFieldTextComponent,
    number: FormFieldNumberComponent,
    select: FormFieldSelectComponent,
    autocomplete: FormFieldAutocompleteComponent
  };

  constructor() {}

  ngOnInit(): void {
    this.view().clear();
    const ref = this.view().createComponent(this.fields[this.field().type]);
    ref?.setInput("field", this.field());
  }

  ngOnDestroy(): void {
    this.view().clear();
  }
}
