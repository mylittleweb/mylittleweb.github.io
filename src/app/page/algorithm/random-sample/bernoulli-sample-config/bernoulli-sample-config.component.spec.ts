import {ComponentFixture, TestBed} from "@angular/core/testing";

import {BernoulliSampleConfigComponent} from "./bernoulli-sample-config.component";

describe("BernoulliSampleConfigComponent", () => {
  let component: BernoulliSampleConfigComponent;
  let fixture: ComponentFixture<BernoulliSampleConfigComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [BernoulliSampleConfigComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BernoulliSampleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
