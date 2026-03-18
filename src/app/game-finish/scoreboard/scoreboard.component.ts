import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, filter } from 'rxjs';
import { GameService } from 'src/app/services/game';
import { AuthService } from 'src/app/services/auth';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trophyOutline, homeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonSpinner],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Qahoot</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="kh-page">

        <div class="kh-header">
          <div class="kh-logo">Qahoot</div>
          <div class="kh-host-badge">Results</div>
        </div>

        <!-- Podium top 3 -->
        <div class="kh-podium">
          <div class="kh-podium-slot second">
            <div class="kh-podium-avatar">B</div>
            <div class="kh-podium-name">Player 2</div>
            <div class="kh-podium-score">8000 pts</div>
            <div class="kh-podium-block p2">2</div>
          </div>
          <div class="kh-podium-slot first">
            <ion-icon name="trophy-outline" class="kh-trophy"></ion-icon>
            <div class="kh-podium-avatar gold">A</div>
            <div class="kh-podium-name">Player 1</div>
            <div class="kh-podium-score">10000 pts</div>
            <div class="kh-podium-block p1">1</div>
          </div>
          <div class="kh-podium-slot third">
            <div class="kh-podium-avatar">C</div>
            <div class="kh-podium-name">Player 3</div>
            <div class="kh-podium-score">6000 pts</div>
            <div class="kh-podium-block p3">3</div>
          </div>
        </div>

        <!-- Full rankings -->
        <div class="kh-rankings-card">
          <div class="kh-rankings-header">
            <ion-icon name="trophy-outline"></ion-icon>
            <span>Full Rankings</span>
          </div>
          <div class="kh-rankings-list">
            <div class="kh-rank-row me">
              <span class="kh-rank-num">#1</span>
              <div class="kh-rank-avatar gold">A</div>
              <span class="kh-rank-name">
                Player 1
                <span class="kh-you-badge">You</span>
              </span>
              <div class="kh-rank-right">
                <span class="kh-rank-correct">10 correct</span>
                <span class="kh-rank-total">10000 pts</span>
              </div>
            </div>
            <div class="kh-rank-row">
              <span class="kh-rank-num">#2</span>
              <div class="kh-rank-avatar">B</div>
              <span class="kh-rank-name">Player 2</span>
              <div class="kh-rank-right">
                <span class="kh-rank-correct">8 correct</span>
                <span class="kh-rank-total">8000 pts</span>
              </div>
            </div>
            <div class="kh-rank-row">
              <span class="kh-rank-num">#3</span>
              <div class="kh-rank-avatar">C</div>
              <span class="kh-rank-name">Player 3</span>
              <div class="kh-rank-right">
                <span class="kh-rank-correct">6 correct</span>
                <span class="kh-rank-total">6000 pts</span>
              </div>
            </div>
          </div>
        </div>

        <button class="kh-home-btn" (click)="goHome()">
          <ion-icon name="home-outline"></ion-icon>
          Back to Home
        </button>

      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --kh-purple: #46178f;
      --kh-purple-dark: #2d0f5e;
      --kh-yellow: #ffcc00;
      --kh-yellow-dark: #e6b800;
      --kh-radius: 12px;
      --kh-font: 'Nunito', sans-serif;
    }

    ion-content { --background: var(--kh-purple); }
    ion-toolbar { --background: var(--kh-purple); --color: white; }

    .kh-page {
      min-height: 100vh;
      background: var(--kh-purple);
      background-image:
        radial-gradient(circle at 15% 15%, rgba(255,255,255,0.07) 0%, transparent 45%),
        radial-gradient(circle at 85% 85%, rgba(255,255,255,0.04) 0%, transparent 45%);
      display: flex; flex-direction: column; align-items: center;
      padding: 32px 20px 48px; gap: 20px;
      font-family: var(--kh-font);
    }

    .kh-header {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; max-width: 480px;
    }
    .kh-logo {
      font-size: 1.5rem; font-weight: 900; color: white;
      text-shadow: 0 3px 0 rgba(0,0,0,0.3);
    }
    .kh-host-badge {
      background: var(--kh-yellow); color: #111;
      font-size: 0.7rem; font-weight: 900; padding: 4px 12px;
      border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px;
      box-shadow: 0 3px 0 var(--kh-yellow-dark);
    }

    .kh-podium {
      width: 100%; max-width: 480px;
      display: flex; align-items: flex-end; justify-content: center; gap: 8px;
    }
    .kh-podium-slot {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      flex: 1;
    }
    .kh-trophy { font-size: 2rem; color: var(--kh-yellow); margin-bottom: 4px; }
    .kh-podium-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.2); color: white;
      font-weight: 900; font-size: 1.1rem;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .kh-podium-avatar.gold {
      background: var(--kh-yellow); color: #111;
      border-color: var(--kh-yellow-dark);
      box-shadow: 0 4px 0 var(--kh-yellow-dark);
    }
    .kh-podium-name {
      color: white; font-weight: 800; font-size: 0.8rem;
      text-align: center; max-width: 80px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .kh-podium-score { color: var(--kh-yellow); font-weight: 900; font-size: 0.85rem; }
    .kh-podium-block {
      width: 100%; border-radius: 8px 8px 0 0;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 1.2rem;
    }
    .p1 { height: 80px; background: var(--kh-yellow); color: #111; }
    .p2 { height: 60px; background: rgba(255,255,255,0.25); color: white; }
    .p3 { height: 44px; background: rgba(255,255,255,0.15); color: white; }

    .kh-rankings-card {
      width: 100%; max-width: 480px;
      background: rgba(255,255,255,0.1);
      border: 2px solid rgba(255,255,255,0.18);
      border-radius: 16px; overflow: hidden;
    }
    .kh-rankings-header {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 14px; background: rgba(255,255,255,0.1);
      color: white; font-weight: 800; font-size: 0.88rem;
      border-bottom: 1px solid rgba(255,255,255,0.12);
    }
    .kh-rankings-list {
      padding: 8px; display: flex; flex-direction: column; gap: 6px;
    }
    .kh-rank-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; background: rgba(255,255,255,0.08);
      border-radius: 8px; animation: kh-pop-in 0.25s ease;
    }
    .kh-rank-row.me {
      background: color-mix(in srgb, var(--kh-yellow) 20%, transparent);
      border: 1px solid color-mix(in srgb, var(--kh-yellow) 40%, transparent);
    }
    @keyframes kh-pop-in {
      from { transform: scale(0.85); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }
    .kh-rank-num {
      color: rgba(255,255,255,0.5); font-weight: 900;
      font-size: 0.85rem; min-width: 24px;
    }
    .kh-rank-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.2); color: white;
      font-weight: 900; font-size: 0.9rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .kh-rank-avatar.gold {
      background: var(--kh-yellow); color: #111;
      box-shadow: 0 3px 0 var(--kh-yellow-dark);
    }
    .kh-rank-name {
      flex: 1; color: white; font-weight: 700; font-size: 0.88rem;
      display: flex; align-items: center; gap: 6px;
    }
    .kh-you-badge {
      background: var(--kh-yellow); color: #111;
      font-size: 0.65rem; font-weight: 900; padding: 2px 8px;
      border-radius: 99px; text-transform: uppercase;
    }
    .kh-rank-right {
      display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
    }
    .kh-rank-correct { font-size: 0.75rem; color: #4ade80; font-weight: 700; }
    .kh-rank-total { font-size: 0.88rem; color: var(--kh-yellow); font-weight: 900; }

    .kh-home-btn {
      width: 100%; max-width: 480px; padding: 18px; border: none;
      border-radius: var(--kh-radius); background: var(--kh-yellow); color: #111;
      font-family: var(--kh-font); font-weight: 900; font-size: 1.1rem;
      cursor: pointer; box-shadow: 0 6px 0 var(--kh-yellow-dark);
      display: flex; align-items: center; justify-content: center; gap: 10px;
      transition: transform 0.1s, box-shadow 0.1s;
    }
    .kh-home-btn:active {
      transform: translateY(4px); box-shadow: 0 2px 0 var(--kh-yellow-dark);
    }
    .kh-home-btn ion-icon { font-size: 1.2rem; }
  `]
})
export class ScoreboardComponent implements OnInit {
  private router = inject(Router);

  constructor() {
    addIcons({ trophyOutline, homeOutline });
  }

  ngOnInit() {}

  goHome() {
    this.router.navigate(['/home']);
  }
}