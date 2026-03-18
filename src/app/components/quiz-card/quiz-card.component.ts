import { Component, input, inject, signal } from '@angular/core';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonButton, IonIcon, IonSpinner,
} from '@ionic/angular/standalone';
import { Quiz } from 'src/app/models/quiz';
import { RouterLink, Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { playOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { GameService } from 'src/app/services/game';  // ← plus QuizService

@Component({
  selector: 'quiz-card',
  template: `
    @let quiz = this.quiz();
    <ion-card [routerLink]="'/quiz-detail/' + quiz.id">
      <ion-card-header>
        <ion-card-title>
          {{ quiz.title | titlecase }}
          <ion-button
            class="ion-float-right"
            [disabled]="loading()"
            (click)="createGame($event)"
          >
            @if (loading()) {
              <ion-spinner slot="icon-only" name="crescent" />
            } @else {
              <ion-icon slot="icon-only" name="play-outline" />
            }
          </ion-button>
        </ion-card-title>
        <ion-card-subtitle>
          Questions: {{ quiz.questionsCount }}
        </ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        {{ quiz.description }}
      </ion-card-content>
    </ion-card>
  `,
  imports: [
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonButton, IonIcon, IonSpinner,
    RouterLink, TitleCasePipe,
  ],
})
export class QuizCard {
  readonly quiz = input.required<Quiz>();
  private router = inject(Router);
  private gameService = inject(GameService);  
  loading = signal(false);

  constructor() {
    addIcons({ playOutline });
  }

  async createGame(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.loading.set(true);
    try {  
      const gameId = await this.gameService.createGame(this.quiz().id);
      this.router.navigate(['/game-lobby', gameId]);  
    } catch (err) {
      console.error('Impossible de créer le game', err);
    } finally {
      this.loading.set(false);
    }
  }
}