import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, filter } from 'rxjs';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  where,
  collection,
  query,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  Firestore,
  getDoc
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Game } from '../models/game';
import { collectionData, docData } from 'rxfire/firestore';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class GameService {
  private firestore: Firestore;
  private authService = inject(AuthService);

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.firestore = getFirestore(app);
  }

  async createGame(quizId: string): Promise<string> {
    const user = await firstValueFrom(this.authService.getConnectedUser());
    if (!user) throw new Error('Not authenticated');

    const gamesRef = collection(this.firestore, 'games');
    const gameRef = doc(gamesRef);

    await setDoc(gameRef, {
      refQuiz: quizId,
      entryCode: this.generateEntryCode(),
      status: 'waiting',
      players: [],
      adminId: user.uid,          
      currentQuestionIndex: 0,
      currentQuestionStatus: 'in-progress',
      createdAt: new Date(),
    });

    return gameRef.id;
  }

  async endGame(gameId: string): Promise<void> {
    await updateDoc(doc(this.firestore, 'games', gameId), {
      status: 'finished',
    });
  }
  getGame(gameId: string): Observable<Game> {
    const gameDoc = doc(this.firestore, 'games', gameId);
    return docData(gameDoc, { idField: 'id' }) as Observable<Game>;
  }

  getGameByEntryCode(entryCode: string): Observable<Game[]> {
    const gamesRef = collection(this.firestore, 'games');
    const q = query(
      gamesRef,
      where('entryCode', '==', entryCode.toUpperCase().trim()),
      where('status', '==', 'waiting')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Game[]>;
  }

  async joinGame(gameId: string, alias: string): Promise<void> {
    const user = await firstValueFrom(this.authService.getConnectedUser());
    if (!user) throw new Error('Not authenticated');

    const playerEntry = {
      uid: user.uid,
      alias,
    };

    await updateDoc(doc(this.firestore, 'games', gameId), {
      players: arrayUnion(playerEntry),
    });
  }

  async leaveGame(gameId: string, alias: string): Promise<void> {
    const user = await firstValueFrom(this.authService.getConnectedUser());
    if (!user) return;

    const playerEntry = {
      uid: user.uid,
      alias,
    };

    await updateDoc(doc(this.firestore, 'games', gameId), {
      players: arrayRemove(playerEntry),
    });
  }

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

  async nextQuestion(gameId: string, nextIndex: number): Promise<void> {
    await updateDoc(doc(this.firestore, 'games', gameId), {
      currentQuestionIndex: nextIndex,
      currentQuestionStatus: 'in-progress',
    });
  }
  async submitAnswer(
    gameId: string,
    questionIndex: number,
    choiceIndex: number
  ): Promise<void> {
    const user = await firstValueFrom(
      this.authService.getConnectedUser().pipe(filter(u => u !== null))
    );
    if (!user) throw new Error('Not authenticated');

    const answerRef = doc(
      this.firestore,
      `games/${gameId}/answers/${questionIndex}_${user.uid}`
    );

    await setDoc(answerRef, {
      uid: user.uid,
      questionIndex,
      choiceIndex,
      answeredAt: new Date(),
    });
  }

  getAnswersForQuestion(gameId: string, questionIndex: number): Observable<any[]> {
    const answersRef = collection(this.firestore, `games/${gameId}/answers`);
    const q = query(answersRef, where('questionIndex', '==', questionIndex));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  async hasAnswered(gameId: string, questionIndex: number): Promise<boolean> {
    const user = await firstValueFrom(
      this.authService.getConnectedUser().pipe(filter(u => u !== null))
    );
    if (!user) return false;

    const answerRef = doc(
      this.firestore,
      `games/${gameId}/answers/${questionIndex}_${user.uid}`
    );
    const snap = await getDoc(answerRef);
    return snap.exists();
  }
}