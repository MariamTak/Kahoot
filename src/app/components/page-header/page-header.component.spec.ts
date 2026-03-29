import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { PageHeader} from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeader;
  let fixture: ComponentFixture<PageHeader>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ PageHeader ],
      providers: [
        provideRouter([]),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
