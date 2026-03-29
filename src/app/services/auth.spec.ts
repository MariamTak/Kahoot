import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment
} from '../../environments/environment';
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
