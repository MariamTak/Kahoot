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
  selector: 'app-game-waiting',
  templateUrl: './game-waiting.component.html',
  styleUrls: ['./game-waiting.component.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonIcon, IonSpinner,
    QRCodeComponent
  ],
})
export class GameWaitingComponent  implements OnInit {

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
    console.log('startGame called');
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
