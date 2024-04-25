import {ComponentFixture, TestBed} from "@angular/core/testing";

import {UniformSampleConfigComponent} from "./uniform-sample-config.component";

describe("UniformSampleConfigComponent", () => {
  let component: UniformSampleConfigComponent;
  let fixture: ComponentFixture<UniformSampleConfigComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [UniformSampleConfigComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UniformSampleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
