import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "autocomplete";
  formControl: FormControl;
}
export type FormFieldType = FormField["type"];

export interface TextField extends FormField {
  type: "text";
}

export interface NumberField extends FormField {
  type: "number";
}

export interface AutoCompleteField extends FormField {
  type: "autocomplete";
  options: Observable<string[]>;
}

export interface SelectField extends FormField {
  type: "select";
  options: Observable<Option[]>;
}

export interface Option {
  label: string;
  value: any;
}


export const FormFields = {
  text: (name: string, label: string, control: FormControl): TextField => {
    return {
      type: "text", name: name, label: label, formControl: control
    };
  },

  number: (name: string, label: string, control: FormControl): NumberField => {
    return {
      type: "number", name: name, label: label, formControl: control
    };
  },

  autocomplete: (name: string, label: string, control: FormControl, options: Observable<string[]>): AutoCompleteField =>{
    return {
      type: "autocomplete", name: name, label: label, formControl: control,
      options: options
    };
  },

  select: (name: string, label: string, control: FormControl, options: Observable<Option[]>): SelectField =>{
    return {
      type: "select", name: name, label: label, formControl: control,
      options: options
    };
  }
};
