import { Component, Input } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { Quiz } from 'src/app/models/quiz';

@Component({
  selector: 'quiz-card',
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent
  ],
  template: `
<ion-card>
  <ion-card-header>
    <ion-card-title>{{ quiz.title }}</ion-card-title>
    <ion-card-subtitle>{{ quiz.description }}</ion-card-subtitle>
  </ion-card-header>

  <ion-card-content>
    Nombre de questions : {{ quiz.questions.length }}
  </ion-card-content>
</ion-card>
`
})
export class QuizCardComponent {
 @Input() quiz!: Quiz;
}
