import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  updateDoc,
  setDoc,
  Firestore,
} from 'firebase/firestore';
import { docData } from 'rxfire/firestore';
import { environment } from 'src/environments/environment';
import { Game } from '../models/game';

@Injectable({ providedIn: 'root' })
export class GameService {
  private firestore: Firestore;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.firestore = getFirestore(app);
  }

  async createGame(quizId: string): Promise<string> {
    const gamesRef = collection(this.firestore, 'games');
    const gameRef = doc(gamesRef);

    await setDoc(gameRef, {
      refQuiz: quizId,
      entryCode: this.generateEntryCode(),
      status: 'waiting',
      players: [],
      currentQuestionIndex: 0,
      currentQuestionStatus: 'in-progress',
      createdAt: new Date(),
    });

    return gameRef.id;
  }

  // Écoute le game en temps réel
  getGame(gameId: string): Observable<Game> {
    const gameDoc = doc(this.firestore, 'games', gameId);
    return docData(gameDoc, { idField: 'id' }) as Observable<Game>;
  }

  // Démarre le game
  async startGame(gameId: string): Promise<void> {
    await updateDoc(doc(this.firestore, 'games', gameId), {
      status: 'in-progress',
    });
  }

  private generateEntryCode(length = 4): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }
}