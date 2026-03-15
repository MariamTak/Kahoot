import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonInput,
  IonList,
  IonTextarea,
  ModalController,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonRadio,
  IonRadioGroup,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';

import { Quiz } from 'src/app/models/quiz';
import { QuizService } from 'src/app/services/quiz';
import { addIcons } from 'ionicons';
import { removeOutline } from 'ionicons/icons'; 

@Component({
  selector: 'app-quiz-update-modal',
  standalone: true,
  template: `@if (isReady()) {
  <form [formGroup]="quizForm" (ngSubmit)="confirm()" id="updateQuizForm" novalidate>

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" (click)="cancel()">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Update Quiz</ion-title>
        <ion-buttons slot="end">
          <ion-button
            type="submit"
            form="updateQuizForm"
            [strong]="true"
            [disabled]="quizForm.invalid"
          >
            Update
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" [fullscreen]="true">
      <ion-list>
        <ion-item>
          <ion-input
            labelPlacement="stacked"
            label="Title"
            formControlName="title"
            placeholder="Enter quiz title"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-textarea
            labelPlacement="stacked"
            label="Description"
            formControlName="description"
            placeholder="Enter quiz description"
            [rows]="4"
          ></ion-textarea>
        </ion-item>
      </ion-list>

      <ion-row formArrayName="questions">

        @for (question of questionsArray.controls; track $index; let qi = $index) {
          <ion-col size="12" [formGroupName]="qi">
            <ion-card>

              <ion-card-header>
                <ion-row style="align-items: center;">
                  <ion-col>
                    <ion-input
                      aria-label="Enter the question text"
                      formControlName="text"
                      placeholder="Question"
                    ></ion-input>
                  </ion-col>
                  <ion-col size="auto">
                    <ion-button fill="clear" color="danger" (click)="removeQuestion(qi)">
                      <ion-icon name="remove-outline"></ion-icon>
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-card-header>

              <ion-card-content>
                <ion-radio-group formControlName="correctChoiceIndex">
                  <ion-list lines="none" formArrayName="choices">

                    <ion-item>
                      <ion-label>Choices</ion-label>
                      <ion-label slot="end">Correct</ion-label>
                    </ion-item>

                    @for (choice of getChoices(qi).controls; track $index; let ci = $index; let first = $first) {
                      <ion-item [formGroupName]="ci">
                        <ion-input
                          aria-label="Enter the choice text"
                          formControlName="text"
                          placeholder="Choice"
                        ></ion-input>
                        <ion-radio slot="end" [value]="ci"></ion-radio>
                       
                          <ion-button fill="clear" slot="end" color="danger" (click)="removeChoice(qi, ci)">
                            <ion-icon name="remove-outline"></ion-icon>
                          </ion-button>
                      
                          <span slot="end" style="width: 2rem;"></span>
                        
                      </ion-item>
                    }

                  </ion-list>
                </ion-radio-group>
                <ion-button (click)="addChoice(qi)" expand="full">Add choice</ion-button>
              </ion-card-content>

            </ion-card>
          </ion-col>
        }

      </ion-row>
      <ion-button expand="block" (click)="addQuestion()">Add question</ion-button>
    </ion-content>

  </form>
}
`,
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    IonList,
    IonTextarea,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonRadio,
    IonRadioGroup,
    IonLabel,
    IonIcon,
  ],
})
export class QuizUpdateModalComponent implements OnInit {

  private readonly modalCtrl = inject(ModalController);
  private readonly fb = inject(FormBuilder);
  private readonly q = inject(QuizService);

    constructor() {
    addIcons({ removeOutline });
  }

  @Input() quiz!: Quiz;

  isReady = signal(false);

  quizForm!: FormGroup;

  get questionsArray(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getChoices(questionIndex: number): FormArray {
    return this.questionsArray.at(questionIndex).get('choices') as FormArray;
  }
  addQuestion() {
    const newQuestionId = this.q.generateQuestionId(this.quiz.id);
    this.questionsArray.push(
      this.fb.group({       
        id: [newQuestionId], 
        text: ['', Validators.required],
        correctChoiceIndex: [0],
        choices: this.fb.array([  this.fb.group({ text: ['', Validators.required] })        ])
      })
    );
  } 
 
  ngOnInit() {
    this.quizForm = this.fb.group({
      id: [this.quiz.id],
      title: [this.quiz.title, Validators.required],
      description: [this.quiz.description],
      questions: this.fb.array(
        (this.quiz.questions ?? []).map(q =>
          this.fb.group({
            id: [q.id],
            text: [q.text, Validators.required],
            correctChoiceIndex: [q.correctChoiceIndex],
            choices: this.fb.array(
              (q.choices ?? []).map(c =>
                this.fb.group({ text: [c.text, Validators.required] })
              )
            ),
          })
        )
      ),
    });
    this.isReady.set(true);
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.quizForm.invalid) return;
    this.modalCtrl.dismiss(this.quizForm.value, 'confirm');
  }

  removeQuestion(index: number) {
    this.questionsArray.removeAt(index);
  }

  addChoice(questionIndex: number) {
    this.getChoices(questionIndex).push(this.fb.group({ text: ['', Validators.required] }));
  }

  removeChoice(questionIndex: number, choiceIndex: number) {
    this.getChoices(questionIndex).removeAt(choiceIndex);
  }
}