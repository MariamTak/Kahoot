import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { QuizService } from '../services/quiz';
import { AsyncPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { QuizCardComponent } from '../components/quiz-card/quiz-card.component';
import {
  IonFab,
  IonFabButton,
  ModalController,
  IonIcon} from '@ionic/angular/standalone';
import { QuizCreationModalComponent } from '../components/quiz-creation-modal/quiz-creation-modal.component';

@Component({
  selector: 'app-home',
  template: `
<ion-header translucent>
  <ion-toolbar>
    <ion-title>Quizzes</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content >
  <ion-fab slot="fixed" vertical="bottom" horizontal="end">
    <ion-fab-button (click)="openModal()">
      <ion-icon name="add-outline"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  @let _quizzes = quizzes | async;

  <ion-grid >
    <ion-row>
      @for (quiz of _quizzes; track quiz.id) {
        <ion-col size="12" sizeMd="6">
          <quiz-card [quiz]="quiz"></quiz-card>
        </ion-col>
      }
    </ion-row>
  </ion-grid>


</ion-content>
`,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, AsyncPipe, IonGrid,QuizCardComponent, IonRow, IonCol, IonFab, IonFabButton, IonIcon],
})
export class HomePage {
private quizService = inject(QuizService);
private modalController = inject(ModalController);
  quizzes = this.quizService.getAll();
  //legacy : dans constructor
  ngOnInit(): void {
    this.quizzes = this.quizService.getAll();
  }
constructor() {
  addIcons({ addOutline });
}
async openModal() {
  const modal = await this.modalController.create({
    component: QuizCreationModalComponent,
  });
modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.quizService.addQuiz(data);
      this.quizzes = this.quizService.getAll();} 
}}
