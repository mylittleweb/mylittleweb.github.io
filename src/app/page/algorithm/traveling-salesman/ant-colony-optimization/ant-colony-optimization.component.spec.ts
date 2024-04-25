import {ComponentFixture, TestBed} from "@angular/core/testing";

import {AntColonyOptimizationComponent} from "./ant-colony-optimization.component";

describe("AntColonyOptimizationComponent", () => {
  let component: AntColonyOptimizationComponent;
  let fixture: ComponentFixture<AntColonyOptimizationComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [AntColonyOptimizationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AntColonyOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
