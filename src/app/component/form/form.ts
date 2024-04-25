import {FormGroup} from "@angular/forms";
import {FormField} from "./form-field";


export class Form {
  private _formGroup = new FormGroup({});

  constructor(private _fields: FormField[]) {
    this.configFormGroup();
  }

  fields() {
    return this._fields;
  }

  group() {
    return this._formGroup;
  }

  control(name: string) {
    return this._formGroup.get(name);
  }

  valueChanges() {
    return this._formGroup.valueChanges;
  }

  private configFormGroup() {
    for (const field of this.fields()) {
      this._formGroup.setControl(field.name, field.formControl);
    }
  }
}
