import {ComponentFixture, TestBed} from "@angular/core/testing";

import {NormalSampleConfigComponent} from "./normal-sample-config.component";

describe("NormalSampleConfigComponent", () => {
  let component: NormalSampleConfigComponent;
  let fixture: ComponentFixture<NormalSampleConfigComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [NormalSampleConfigComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NormalSampleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
