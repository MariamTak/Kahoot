import { TestBed } from '@angular/core/testing';

import { GameService as Game } from './game';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
describe('Game', () => {
  let service: Game;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
      ]
    });
    service = TestBed.inject(Game);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
