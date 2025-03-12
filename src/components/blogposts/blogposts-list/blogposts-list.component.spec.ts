import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogpostsListComponent } from './blogposts-list.component';

describe('BlogpostsListComponent', () => {
  let component: BlogpostsListComponent;
  let fixture: ComponentFixture<BlogpostsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogpostsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogpostsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
