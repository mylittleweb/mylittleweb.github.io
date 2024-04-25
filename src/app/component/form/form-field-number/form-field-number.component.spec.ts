import {ComponentFixture, TestBed} from "@angular/core/testing";

import {FormFieldNumberComponent} from "./form-field-number.component";

describe("FormFieldNumberComponent", () => {
  let component: FormFieldNumberComponent;
  let fixture: ComponentFixture<FormFieldNumberComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [FormFieldNumberComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormFieldNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
