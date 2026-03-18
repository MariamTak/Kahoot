import { Component, input, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from 'src/app/models/question';
import { PlayerScore } from 'src/app/models/player';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline, trophyOutline } from 'ionicons/icons';

@Component({
  selector: 'app-question-board',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div class="qb-overlay">
      <div class="qb-card">

        <!-- Correct answer -->
        <div class="qb-section">
          <div class="qb-label">Correct Answer</div>
          <div class="qb-answer-text">
            {{ 'ABCD'[question().correctChoiceIndex] }} — {{ correctChoiceText() }}
          </div>
        </div>

        <!-- Stats -->
        <div class="qb-stats">
          <div class="qb-stat correct">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
            {{ correctCount() }} correct
          </div>
          <div class="qb-stat wrong">
            <ion-icon name="close-circle-outline"></ion-icon>
            {{ wrongCount() }} wrong
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="qb-label" style="text-align:center">Leaderboard</div>
        <div class="qb-players">
          @for (s of sortedScores(); track s.uid; let i = $index) {
            <div class="qb-player-row" [class.top]="i === 0">
              <span class="qb-rank">{{ i + 1 }}</span>
              <span class="qb-alias">{{ s.alias }}</span>
              @if (s.lastQuestionScore > 0) {
                <span class="qb-delta">+{{ s.lastQuestionScore }}</span>
              }
              <span class="qb-total">{{ s.totalScore }} pts</span>
            </div>
          }
        </div>

        <!-- Admin: next button -->
        @if (isAdmin()) {
          <button class="qb-next-btn" (click)="onNext.emit()">
            <ion-icon [name]="isLast() ? 'trophy-outline' : 'arrow-forward-outline'"></ion-icon>
            {{ isLast() ? 'Finish Game!' : 'Next Question' }}
          </button>
        } @else {
          <div class="qb-waiting">
            Waiting for host…
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .qb-overlay {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(46,17,143,0.97);
      display: flex; align-items: center; justify-content: center;
      padding: 24px; animation: fade-in 0.3s ease;
      overflow-y: auto;
    }
    @keyframes fade-in { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }

    .qb-card {
      background: rgba(255,255,255,0.08);
      border: 2px solid rgba(255,255,255,0.18);
      border-radius: 20px; padding: 28px 24px;
      width: 100%; max-width: 480px;
      display: flex; flex-direction: column; gap: 16px;
    }

    .qb-label {
      color: rgba(255,255,255,0.6); font-size: 0.75rem;
      font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .qb-answer-text {
      background: #26890c; color: white;
      font-size: 1.1rem; font-weight: 900;
      padding: 14px 20px; border-radius: 12px;
      box-shadow: 0 5px 0 #1a5c08; text-align: center;
    }

    .qb-stats {
      display: flex; gap: 12px; justify-content: center;
    }
    .qb-stat {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 99px;
      font-weight: 800; font-size: 0.9rem;
    }
    .qb-stat.correct { background: rgba(38,137,12,0.25); color: #6ddc4a; }
    .qb-stat.wrong   { background: rgba(232,64,64,0.25); color: #f08080; }

    .qb-players {
      display: flex; flex-direction: column; gap: 8px;
      max-height: 240px; overflow-y: auto;
    }
    .qb-player-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px;
      background: rgba(255,255,255,0.07);
      animation: pop 0.2s ease;
    }
    .qb-player-row.top { background: rgba(255,204,0,0.15); border: 1px solid rgba(255,204,0,0.3); }
    @keyframes pop { from { transform:translateX(-8px); opacity:0 } to { transform:none; opacity:1 } }

    .qb-rank {
      width: 24px; color: rgba(255,255,255,0.4);
      font-weight: 900; font-size: 0.85rem;
    }
    .top .qb-rank { color: #ffcc00; }
    .qb-alias { flex: 1; color: white; font-weight: 700; font-size: 0.9rem; }
    .qb-delta { color: #6ddc4a; font-weight: 900; font-size: 0.85rem; }
    .qb-total { color: #ffcc00; font-weight: 900; font-size: 0.9rem; min-width: 60px; text-align: right; }

    .qb-next-btn {
      width: 100%; padding: 18px; border: none;
      border-radius: 12px; background: #ffcc00; color: #111;
      font-weight: 900; font-size: 1.2rem; cursor: pointer;
      box-shadow: 0 6px 0 #e6b800;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      transition: transform 0.1s, box-shadow 0.1s;
    }
    .qb-next-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #e6b800; }
    .qb-next-btn ion-icon { font-size: 1.2rem; }

    .qb-waiting {
      text-align: center; color: rgba(255,255,255,0.5);
      font-weight: 700; padding: 12px;
    }
  `]
})
export class QuestionBoardComponent {
  question = input.required<Question>();
  scores = input.required<PlayerScore[]>();
  answers = input.required<any[]>();
  players = input.required<{ uid: string; alias: string }[]>();
  isAdmin = input.required<boolean>();
  isLast = input.required<boolean>();
  onNext = output<void>();

  constructor() {
    addIcons({ checkmarkCircleOutline, closeCircleOutline, trophyOutline });
  }

  correctChoiceText = computed(() =>
    this.question().choices[this.question().correctChoiceIndex]?.text ?? '?'
  );

  sortedScores = computed(() =>
    [...this.scores()].sort((a, b) => b.totalScore - a.totalScore)
  );

  correctCount = computed(() =>
    this.answers().filter(a => a.choiceIndex === this.question().correctChoiceIndex).length
  );

  wrongCount = computed(() =>
    this.players().length - this.correctCount()
  );
  
}