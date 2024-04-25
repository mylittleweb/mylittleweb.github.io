import {ComponentFixture, TestBed} from "@angular/core/testing";

import {RandomSampleComponent} from "./random-sample.component";

describe("RandomSampleComponent", () => {
  let component: RandomSampleComponent;
  let fixture: ComponentFixture<RandomSampleComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [RandomSampleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RandomSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
