import {ComponentFixture, TestBed} from "@angular/core/testing";

import {FormFieldAutocompleteComponent} from "./form-field-autocomplete.component";

describe("FormFieldAutocompleteComponent", () => {
  let component: FormFieldAutocompleteComponent;
  let fixture: ComponentFixture<FormFieldAutocompleteComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [FormFieldAutocompleteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormFieldAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
