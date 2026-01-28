import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  ModalController
} from '@ionic/angular/standalone';
import { Question } from 'src/app/models/question';
import { Quiz } from 'src/app/models/quiz';

type QuizFormData = Omit<Quiz, 'id' | 'questions'> & {
  questions: Omit<Question, 'id' | 'choices' | 'correctChoiceId'>[];
};

@Component({
  selector: 'app-quiz-creation-modal',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    FormField
  ],
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Nouveau Quiz</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="cancel()">Annuler</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding">
  <form>
    <ion-item>
      <ion-input
        label="Titre"
        labelPlacement="stacked"
        placeholder="Entrez le titre"
        [formField]="quizForm.title">
      </ion-input>
    </ion-item>

    <ion-item>
      <ion-input
        label="Description"
        labelPlacement="stacked"
        placeholder="Entrez la description"
        [formField]="quizForm.description">
      </ion-input>
    </ion-item>

    @for (q of quizForm.questions; track  $index) {
      <ion-item>
        <ion-input
          placeholder="Entrez la question"
          [formField]="quizForm.questions[$index].text">
        </ion-input>
        <ion-button fill="clear" color="danger" >
          Supprimer
        </ion-button>
      </ion-item>
    }

    <ion-button expand="block"  class="ion-margin-top">
      Ajouter une question
    </ion-button>

    <ion-button
      expand="block"
      type="button"
      [disabled]="!quizForm().valid()"
      (click)="confirm()"
      class="ion-margin-top">
      Créer
    </ion-button>
  </form>
</ion-content>
  `
})
export class QuizCreationModalComponent {

  quizModel = signal<QuizFormData>({
    title: '',
    description: '',
    questions: []
  });

  quizForm = form(this.quizModel, (schema) => {
    required(schema.title, { message: 'Titre obligatoire' });
    required(schema.description, { message: 'Description obligatoire' });

    //applyeach(schema.questions, QuestionSchema)
  });

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.quizForm().valid()) return;

    this.modalCtrl.dismiss(this.quizForm().value(), 'confirm');
  }
}
