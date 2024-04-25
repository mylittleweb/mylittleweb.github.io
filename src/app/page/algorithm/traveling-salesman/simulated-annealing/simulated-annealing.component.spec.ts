import {ComponentFixture, TestBed} from "@angular/core/testing";

import {SimulatedAnnealingComponent} from "./simulated-annealing.component";

describe("SimulatedAnnealingComponent", () => {
  let component: SimulatedAnnealingComponent;
  let fixture: ComponentFixture<SimulatedAnnealingComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [SimulatedAnnealingComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SimulatedAnnealingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
