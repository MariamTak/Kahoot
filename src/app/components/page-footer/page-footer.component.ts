import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { home, gameController } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import {
  IonToolbar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'page-footer',
  template: ` <ion-toolbar color="light">
      <div class="footer-buttons">
        <ion-button (click)="navigateTo('home')" [strong]="currentPage==='home'" color="medium">
          <ion-icon [icon]="home" ></ion-icon>
          Home
        </ion-button>
        <ion-button (click)="navigateTo('join-game')" [strong]="currentPage==='join-game'" color="medium">
          <ion-icon [icon]="gameController"></ion-icon>
          Games
        </ion-button>
      </div>
    </ion-toolbar>
  `,
    imports: [IonToolbar, IonButton, IonIcon],

  styles: [`
    :host {
      display: block;
      width: 100%;
      background-color: #f8f8f8;
    }

    ion-toolbar {
      display: flex;
      justify-content: center;
      padding: 0 1rem;
    }

    .footer-buttons {
      display: flex;
      justify-content: center;
      gap: 5rem; 
    }

    ion-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.8rem;
    }

    ion-icon {
      font-size: 1.5rem;
      margin-bottom: 0.2rem;
      margin-right: 10px;
    }
  `]
})
export class PageFooter {
  home = home;
  gameController = gameController;
  currentPage = '';

  constructor(private router: Router) {
    addIcons({ home, gameController });
    this.currentPage = this.router.url.includes('join-game') ? 'join-game' : 'home';
  }

  navigateTo(page: 'home' | 'join-game') {
    this.currentPage = page;
    this.router.navigate([page]);
  }
}