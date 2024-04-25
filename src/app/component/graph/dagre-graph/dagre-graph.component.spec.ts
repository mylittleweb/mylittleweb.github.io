import {ComponentFixture, TestBed} from "@angular/core/testing";

import {DagreGraphComponent} from "./dagre-graph.component";

describe("DagreGraphComponent", () => {
  let component: DagreGraphComponent;
  let fixture: ComponentFixture<DagreGraphComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [DagreGraphComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DagreGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
