import {ComponentFixture, TestBed} from "@angular/core/testing";

import {PathSearchComponent} from "./path-search.component";

describe("BreadthFirstSearchComponent", () => {
  let component: PathSearchComponent;
  let fixture: ComponentFixture<PathSearchComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [PathSearchComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PathSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
