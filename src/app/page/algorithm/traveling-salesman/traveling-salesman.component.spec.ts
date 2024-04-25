import {ComponentFixture, TestBed} from "@angular/core/testing";

import {TravelingSalesmanComponent} from "./traveling-salesman.component";

describe("SimulatedAnnealingComponent", () => {
  let component: TravelingSalesmanComponent;
  let fixture: ComponentFixture<TravelingSalesmanComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [TravelingSalesmanComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TravelingSalesmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
