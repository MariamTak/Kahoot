import { Component, signal } from '@angular/core';
import { IonFooter, IonContent, IonButton, IonIcon, IonInput, IonItem } from '@ionic/angular/standalone';
import { PageHeader } from '../components/page-header/page-header.component';
import { PageFooter } from '../components/page-footer/page-footer.component';
import { addIcons } from 'ionicons';
import { qrCode, keypad } from 'ionicons/icons';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';


@Component({
  selector: 'join-game',
  template: `
    <page-header [translucent]="true">Join Game</page-header>

    <ion-content [fullscreen]="true">
      <page-header collapse="condense">Join Game</page-header>

      <div class="join-container">
        <div class="mode-toggle">
          <button class="toggle-btn" [class.active]="mode() === 'code'" (click)="mode.set('code')">
            <ion-icon name="keypad"></ion-icon>
            Enter Code
          </button>
          <button class="toggle-btn" [class.active]="mode() === 'qr'" (click)="mode.set('qr')">
            <ion-icon name="qr-code-outline"></ion-icon>
            Scan QR
          </button>
        </div>

        @if (mode() === 'code') {
          <div class="panel fade-in">
            <p class="hint">Enter the game code provided by your host</p>
            <ion-item class="code-input-item">
              <ion-input
                placeholder="ABC123"
                [maxlength]="8"
                type="text"
                class="code-input"
              ></ion-input>
            </ion-item>
            <ion-button expand="block" class="join-btn" (click)="joinWithCode()">
              Join Game
            </ion-button>
          </div>
        }

        @if (mode() === 'qr') {
          <div class="panel fade-in">
            <p class="hint">Point your camera at the QR code to join</p>

            @if (scanError()) {
              <p class="error-msg">{{ scanError() }}</p>
            }

            @if (scannedCode()) {
              <div class="scanned-result">
                <ion-icon name="checkmark-circle-outline" class="success-icon"></ion-icon>
                <p>Code detected: <strong>{{ scannedCode() }}</strong></p>
              </div>
              <ion-button expand="block" class="join-btn" (click)="joinWithScannedCode()">
                Join Game
              </ion-button>
            } @else {
              <ion-button
                expand="block"
                fill="outline"
                class="join-btn"
                [disabled]="scanning()"
                (click)="startScan()"
              >
                <ion-icon slot="start" name="qr-code-outline"></ion-icon>
                {{ scanning() ? 'Scanning...' : 'Start Camera' }}
              </ion-button>
            }
          </div>
        }
      </div>
    </ion-content>

    <ion-footer>
      <page-footer></page-footer>
    </ion-footer>
  `,
  styles: [`

    .error-msg {
      text-align: center;
      color: var(--ion-color-danger);
      font-size: 0.85rem;
      margin: 0;
    }

    .scanned-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px;
      background: var(--ion-color-success-tint);
      border-radius: 12px;
      text-align: center;
    }

    .success-icon {
      font-size: 2rem;
      color: var(--ion-color-success);
    }

    .scanned-result p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--ion-color-success-shade);
    }
  `],
  imports: [IonContent, IonFooter, IonButton, IonIcon, IonInput, IonItem, PageHeader, PageFooter],
})
export class JoinGamePage {
  mode = signal<'code' | 'qr'>('code');
  scanning = signal(false);
  scannedCode = signal('');
  scanError = signal('');
  gameCode = '';

  constructor() {
    addIcons({ qrCode, keypad });
  }

  async startScan() {
    this.scanError.set('');
    this.scannedCode.set('');
    this.scanning.set(true);

    try {
    const result = await CapacitorBarcodeScanner.scanBarcode({  
      hint: CapacitorBarcodeScannerTypeHint.ALL,
    });

      if (result?.ScanResult) {
        this.scannedCode.set(result.ScanResult);
      } else {
        this.scanError.set('No code detected. Please try again.');
      }
    } catch (err) {
      this.scanError.set('Camera access denied or scan cancelled.');
      console.error('Scan error:', err);
    } finally {
      this.scanning.set(false);
    }
  }

  joinWithCode() {
    if (this.gameCode.trim()) {
      console.log('Joining with code:', this.gameCode);
      // navigate or call your game service here
    }
  }

  joinWithScannedCode() {
    console.log('Joining with scanned code:', this.scannedCode());
  }
}