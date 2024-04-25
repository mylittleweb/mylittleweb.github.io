import {ComponentFixture, TestBed} from "@angular/core/testing";

import {PoissonSampleConfigComponent} from "./poisson-sample-config.component";

describe("PoissonSampleConfigComponent", () => {
  let component: PoissonSampleConfigComponent;
  let fixture: ComponentFixture<PoissonSampleConfigComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [PoissonSampleConfigComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PoissonSampleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
