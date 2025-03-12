import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogpostFormComponent } from './blogpost-form.component';

describe('BlogpostFormComponent', () => {
  let component: BlogpostFormComponent;
  let fixture: ComponentFixture<BlogpostFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogpostFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogpostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
