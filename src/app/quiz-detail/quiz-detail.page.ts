import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonLabel,
  IonFooter,
  IonList,
  IonItem,
  IonButton,
  ModalController,
} from '@ionic/angular/standalone';
import { QuizService } from '../services/quiz';
import { PageHeader } from '../components/page-header/page-header.component';
import { PageFooter } from '../components/page-footer/page-footer.component';
import { QuizUpdateModalComponent} from '../components/quiz-update-modal/quiz-update-modal.component';
import { Quiz } from '../models/quiz';

@Component({
  selector: 'app-quiz-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonFooter,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    IonButton,          // was missing
    PageFooter,
    PageHeader,
    
  ],
  template: `
    <page-header [translucent]="true">Quiz Details</page-header>

    <ion-content [fullscreen]="true" class="ion-padding">
      <page-header collapse="condense">Quiz Details</page-header>

      @if (isLoading()) {
        <div class="ion-text-center ion-padding">
          <p>Loading quiz...</p>
        </div>
      } @else {
        @if (quiz(); as quiz) {
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ quiz.title }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>{{ quiz.description }}</p>
              <ion-button expand="block" (click)="openUpdateModal(quiz)">
                Update Quiz
              </ion-button>
            </ion-card-content>
          </ion-card>

          @if (quiz.questions.length) {
            <ion-list>
              @for (question of quiz.questions; track question.id; let qi = $index) {
                <ion-item>
                  <ion-label>
                    <h2>Question {{ qi + 1 }}:</h2>
                    <p>{{ question.text }}</p>
                    <!-- ✅ afficher l'image si elle existe -->
                        @if (question.imageUrl) {
                          <img
                            [src]="question.imageUrl"
                            style="width:100%; height:160px; object-fit:cover; border-radius:10px; margin: 8px 0;"
                          />
                        }
                    <ul>
                      @for (choice of question.choices; track choice.id; let ci = $index) {
                        <li>
                          {{ ci + 1 }} - {{ choice.text }}
                          @if (choice.id === question.correctChoiceIndex) {
                            <span class="correct-badge">Correct</span>
                          }
                        </li>
                      }
                    </ul>
                  </ion-label>
                </ion-item>
              }
            </ion-list>
          } @else {
            <p class="ion-text-center">No questions available for this quiz.</p>
          }
        } @else {
          <p class="ion-text-center">Quiz not found.</p>
        }
      }
    </ion-content>
    <ion-footer>
      <page-footer></page-footer>
    </ion-footer>
  `,
  styles: [`
    ion-card { margin-bottom: 16px; }
    ul { padding-left: 16px; margin-top: 8px; }
    li { margin-bottom: 4px; }
    .correct-badge { color: #2dd36f; font-weight: bold; margin-left: 8px; }
  `]
})
export class QuizDetailPage {
  private readonly quizService = inject(QuizService);
  private readonly route = inject(ActivatedRoute);
  private readonly modalCtrl = inject(ModalController);  // was missing

  private readonly quizId = this.route.snapshot.paramMap.get('id');
  private quiz$ = this.quizService.getById(this.quizId!);

  protected quiz = toSignal(this.quiz$, { initialValue: null });
  protected isLoading = signal(true);

  constructor() {
    this.quiz$.subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false),
    });
  }

  async openUpdateModal(quiz: Quiz) {
     const modal = await this.modalCtrl.create({
    component: QuizUpdateModalComponent,
    componentProps: { quiz },
  });
  await modal.present();

  const { data, role } = await modal.onWillDismiss<Quiz>();
if (role === 'confirm' && data) {
  // Merge form data with original quiz to restore fields not in the form
  const updatedQuiz: Quiz = {
    ...data,
    id: quiz.id,           // ← restore from original, never trust the form for this
    ownerId: quiz.ownerId, // ← same
  };
  await this.quizService.updateQuiz(updatedQuiz);
}}
}