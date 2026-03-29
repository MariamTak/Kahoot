import { TestBed } from '@angular/core/testing';

import { UserService } from './user';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import {  environment } from '../../environments/environment';
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
      ]
    });
    service = TestBed.inject(UserService  );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
