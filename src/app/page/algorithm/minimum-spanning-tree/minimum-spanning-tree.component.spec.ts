import {ComponentFixture, TestBed} from "@angular/core/testing";

import {MinimumSpanningTreeComponent} from "./minimum-spanning-tree.component";

describe("MinimumSpanningTreeComponent", () => {
  let component: MinimumSpanningTreeComponent;
  let fixture: ComponentFixture<MinimumSpanningTreeComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [MinimumSpanningTreeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MinimumSpanningTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
