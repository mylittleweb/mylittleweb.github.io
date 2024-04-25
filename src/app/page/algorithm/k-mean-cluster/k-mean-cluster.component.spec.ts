import {ComponentFixture, TestBed} from "@angular/core/testing";

import {KMeanClusterComponent} from "./k-mean-cluster.component";

describe("KClusterComponent", () => {
  let component: KMeanClusterComponent;
  let fixture: ComponentFixture<KMeanClusterComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [KMeanClusterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KMeanClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
