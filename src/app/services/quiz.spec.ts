import { TestBed } from '@angular/core/testing';

import { QuizService  } from './quiz';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import {  environment } from '../../environments/environment';
describe('QuizService', () => {
  let service: QuizService ;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
      ]
    });
    service = TestBed.inject(QuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
