import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSearchComponent } from './graph-search.component';

describe('BreadthFirstSearchComponent', () => {
  let component: GraphSearchComponent;
  let fixture: ComponentFixture<GraphSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
