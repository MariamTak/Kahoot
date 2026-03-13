import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game';
import { Game } from 'src/app/models/game';
import { addIcons } from 'ionicons';
import { playOutline, copyOutline, checkmarkOutline, peopleOutline } from 'ionicons/icons';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'game-waiting-page',
  template: `<ion-header>
  <ion-toolbar>
    <ion-title>Game Lobby</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <div class="lobby">

    @if (!game()) {
      <ion-spinner name="crescent" />
    } @else {

      <!-- Status badge -->
      <div class="badge">
        <div class="dot"></div>
        Waiting for players
      </div>

      <!-- Entry code -->
      <div class="code-card">
        <div class="code-eyebrow">Entry Code</div>
        <div class="code-digits">{{ game()!.entryCode }}</div>
        <ion-button
          fill="outline"
          size="small"
          [class.copied]="copied()"
          (click)="copyCode()"
        >
          <ion-icon slot="start" [name]="copied() ? 'checkmark-outline' : 'copy-outline'" />
          {{ copied() ? 'Copied!' : 'Copy code' }}
        </ion-button>
      </div>

      <!-- Players -->
      <div class="players-card">
        <div class="players-header">
          <span class="players-label">
            <ion-icon name="people-outline" />
            Players
          </span>
          <span class="players-count">{{ game()!.players.length }} joined</span>
        </div>

        <div class="players-list">
          @if (game()!.players.length === 0) {
            <div class="empty">Waiting for players…</div>
          }
          @for (player of game()!.players; track player.uid) {
            <div class="player-row">
              <div class="avatar">{{ player.alias[0].toUpperCase() }}</div>
              <span class="player-name">{{ player.alias }}</span>
            </div>
          }
        </div>

        
  @if (game()) {
  <div class="qr-wrapper">
    <qrcode
      [qrdata]="game()!.entryCode"
      [width]="160"
      [errorCorrectionLevel]="'M'"
    />
    <p class="qr-hint">Scan to join</p>
  </div>
}
      </div>

      <ion-button
        expand="block"
        class="start-btn"
        [disabled]="game()!.players.length === 0 || starting()"
        (click)="startGame()"
      >
        @if (starting()) {
          <ion-spinner slot="start" name="crescent" />
        } @else {
          <ion-icon slot="start" name="play-outline" />
        }
        Start Game
      </ion-button>

    }
  </div>
</ion-content>`,
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonIcon, IonSpinner,
    QRCodeComponent
  ],
})
export class GameWaitingPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameService = inject(GameService);

  game = signal<Game | null>(null);
  starting = signal(false);
  copied = signal(false);

  private sub!: Subscription

  constructor() {
    addIcons({ playOutline, copyOutline, checkmarkOutline, peopleOutline });
  }

  ngOnInit() {
    const gameId = this.route.snapshot.paramMap.get('id')!;

    this.sub = this.gameService.getGame(gameId).subscribe((game) => {
      this.game.set(game);
    });
  }

  async copyCode() {
    await navigator.clipboard.writeText(this.game()!.entryCode);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  async startGame() {
    const gameId = this.game()!.id;
    this.starting.set(true);
    try {
      await this.gameService.startGame(gameId);
      this.router.navigate(['/game', gameId, 'play']);
    } finally {
      this.starting.set(false);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

}