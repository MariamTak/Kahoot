import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuizUpdateModalComponent } from './quiz-update-modal.component';

describe('QuizUpdateModalComponent', () => {
  let component: QuizUpdateModalComponent;
  let fixture: ComponentFixture<QuizUpdateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ QuizUpdateModalComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
