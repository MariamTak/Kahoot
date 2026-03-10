import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { QuizService } from '../services/quiz';
import { QuizCard } from '../components/quiz-card/quiz-card.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { CreateQuizModal } from '../components/quiz-creation-modal/quiz-creation-modal.component';
import { PageHeader } from '../components/page-header/page-header.component';

@Component({
  selector: 'quiz-list',
  template: `
    <page-header [translucent]="true">Home</page-header>

    <ion-content [fullscreen]="true">
      <page-header collapse="condense">Home</page-header>

      <div id="container">
        <ion-grid>
          <ion-row class="ion-justify-content-center ion-align-items-center">
            @if (isLoading()) {
              <ion-col class="ion-text-center">
                <p>Loading quizzes...</p>
              </ion-col>
            } @else {
              @for (quiz of quizzes(); track quiz.id) {
                <ion-col>
                  <quiz-card [quiz]="quiz" />
                </ion-col>
              } @empty {
                <ion-col class="ion-text-center">
                  No quiz created yet,
                  <a (click)="openCreateQuizModal()">Create your first one</a>
                </ion-col>
              }
            }
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
    <ion-fab slot="fixed" horizontal="end" vertical="bottom">
      <ion-fab-button (click)="openCreateQuizModal()">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    QuizCard,
    IonFab,
    IonFabButton,
    IonIcon,
    PageHeader,
  ],
})
export class HomePage {
  private readonly quizService = inject(QuizService);
  private readonly modalCtrl = inject(ModalController);
  
  private quizzes$ = this.quizService.getAll();
  protected quizzes = toSignal(this.quizzes$, { initialValue: [] });
  protected isLoading = signal(true);

  constructor() {
    addIcons({ add });
    
    // Track loading state
    this.quizzes$.subscribe({
      next: (quizzes) => {
        console.log('Quizzes loaded:', quizzes);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
        this.isLoading.set(false);
      }
    });
  }

  async openCreateQuizModal() {
    const modalRef = await this.modalCtrl.create({
      component: CreateQuizModal,
      cssClass: 'fullscreen-modal',
    });

    modalRef.present();
    const eventDetails = await modalRef.onDidDismiss();
    if (eventDetails.data) {
      try {
        await this.quizService.setQuiz(eventDetails.data);
        // Force refresh by reassigning the observable
        this.quizzes$ = this.quizService.getAll();
        this.quizzes = toSignal(this.quizzes$, { initialValue: [] });
      } catch (error) {
        console.error('Error creating quiz:', error);
      }
    }
  }
}