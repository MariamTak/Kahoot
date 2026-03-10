import { Component, OnInit } from '@angular/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  template: `
  <ion-app>
  <ion-router-outlet></ion-router-outlet>
</ion-app>`,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  async ngOnInit() {
    await SocialLogin.initialize({
      google: {
        webClientId: '847025104477-snfrr5pv834mfsrlj623qdv4u8gfnbpq.apps.googleusercontent.com',
      }
    });
  }
}
