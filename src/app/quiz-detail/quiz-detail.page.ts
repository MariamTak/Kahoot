// src/app/quiz-detail/quiz-detail.page.ts
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
  IonList, 
  IonItem 
} from '@ionic/angular/standalone';
import { QuizService } from '../services/quiz';
import { PageHeader } from '../components/page-header/page-header.component';

@Component({
  selector: 'app-quiz-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    PageHeader
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
            </ion-card-content>
          </ion-card>

          @if (quiz.questions.length) {
            <ion-list>
              @for (question of quiz.questions; track question.id; let qi = $index) {
                <ion-item>
                  <ion-label>
                    <h2>Question {{ qi + 1 }}:</h2>
                    <p>{{ question.text }}</p>
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
  `,
  styles: [`
    ion-card {
      margin-bottom: 16px;
    }
    ul {
      padding-left: 16px;
      margin-top: 8px;
    }
    li {
      margin-bottom: 4px;
    }
    .correct-badge {
      color: #2dd36f;
      font-weight: bold;
      margin-left: 8px;
    }
  `]
})
export class QuizDetailPage {
  private readonly quizService = inject(QuizService);
  private readonly route = inject(ActivatedRoute);
  
  private readonly quizId = this.route.snapshot.paramMap.get('id');
  
  private quiz$ = this.quizService.getById(this.quizId!);
  protected quiz = toSignal(this.quiz$, { initialValue: null });
  protected isLoading = signal(true);

  constructor() {
    // Track loading state
    this.quiz$.subscribe({
      next: (quiz) => {
        console.log('Quiz loaded:', quiz);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
        this.isLoading.set(false);
      }
    });
  }
}