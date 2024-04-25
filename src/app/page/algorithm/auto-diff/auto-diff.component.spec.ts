import {ComponentFixture, TestBed} from "@angular/core/testing";

import {AutoDiffComponent} from "./auto-diff.component";

describe("AutoDiffComponent", () => {
  let component: AutoDiffComponent;
  let fixture: ComponentFixture<AutoDiffComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [AutoDiffComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AutoDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
