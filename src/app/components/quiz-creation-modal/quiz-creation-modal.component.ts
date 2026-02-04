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

//type QuizFormData = Omit<Quiz, 'id' | 'questions'> & {
//  questions: Omit<Question, 'id' | 'choices' | 'correctChoiceId'>[];};

type QuizFormData = {
  title: string;
  description: string;
  questions: {
    text: string;
    choices: { text: string }[];
  }[];
};

@Component({
  selector: 'app-quiz-creation-modal',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
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
    <ion-buttons slot="start">
      <ion-button color="medium" (click)="cancel()">Annuler</ion-button>
    </ion-buttons>


    <ion-buttons slot="end">
      <ion-button
        (click)="confirm()"
        [strong]="true"
        [disabled]="!quizForm().valid()">
        Créer
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <form (submit)="confirm()">

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

    @for (question of quizForm.questions; track $index) {
      <ion-item>
        <ion-input
          label="Question {{$index + 1}}"
          labelPlacement="stacked"
          placeholder="Entrez la question"
          [formField]="question.text">
        </ion-input>
        <ion-button fill="clear" color="danger" slot="end">
          Supprimer
        </ion-button>
      </ion-item>
    @for (choice of question.choices; track $index) {
        <ion-item>
          <ion-input
            label="Choix {{$index + 1}}"  
            labelPlacement="stacked"
            placeholder="Entrez le choix"
            [formField]="choice.text">
          </ion-input>
        </ion-item>
    }

        <ion-button expand="block" fill="outline" class="ion-margin-top" (click)="addChoice($index)">
          Ajouter un choix
        </ion-button>
    }
    <ion-button expand="block" fill="outline" class="ion-margin-top" (click)="addQuestion()">
      Ajouter une question
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
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.quizForm().valid()) return;
    return this.modalCtrl.dismiss(this.quizForm().value(), 'confirm');
  }
  addQuestion() {
  this.quizModel.update(prev => ({
    ...prev,
    questions: [
      ...prev.questions,
      { text: '', choices: [] }
    ]
  }));
}

addChoice(questionIndex: number) {
  this.quizModel.update(prev => ({
    ...prev,
    questions: prev.questions.map((q, index) =>
      index === questionIndex
        ? { ...q, choices: [...q.choices, { text: '' }] }
        : q
    )
  }));
}

}