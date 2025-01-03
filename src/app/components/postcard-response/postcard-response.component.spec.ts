import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostcardResponseComponent } from './postcard-response.component';

describe('PostcardResponseComponent', () => {
  let component: PostcardResponseComponent;
  let fixture: ComponentFixture<PostcardResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostcardResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostcardResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
