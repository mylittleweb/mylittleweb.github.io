import {ComponentFixture, TestBed} from "@angular/core/testing";

import {ExponentialSampleConfigComponent} from "./exponential-sample-config.component";

describe("ExponentialSampleConfigComponent", () => {
  let component: ExponentialSampleConfigComponent;
  let fixture: ComponentFixture<ExponentialSampleConfigComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ExponentialSampleConfigComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExponentialSampleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
