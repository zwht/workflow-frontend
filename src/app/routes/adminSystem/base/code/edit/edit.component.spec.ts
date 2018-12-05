import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserIndexEditComponent } from './edit.component';

describe('UserIndexEditComponent', () => {
  let component: UserIndexEditComponent;
  let fixture: ComponentFixture<UserIndexEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIndexEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIndexEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
