import { inject, Injectable } from '@angular/core';
import { Quiz } from '../models/quiz';
import { Question } from '../models/question';
import { Observable, of, switchMap, tap, firstValueFrom, map , combineLatest} from 'rxjs';
import { AuthService } from './auth';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  query, 
  where, 
  writeBatch, 
  deleteDoc,
  Firestore ,
  setDoc
} from 'firebase/firestore';
import { collectionData, docData } from 'rxfire/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private firestore: Firestore;
  private authService = inject(AuthService);
  
  constructor() {
    // Initialize Firebase with your config
    const app = initializeApp(environment.firebaseConfig);
    this.firestore = getFirestore(app);
  }

getAll(): Observable<Quiz[]> {
  return this.authService.getConnectedUser().pipe(
    tap(user => console.log('Current user:', user)),
    switchMap((user) => {
      if (!user) return of([]);

      const quizzesCollection = collection(this.firestore, 'quizzes');
      const userQuery = query(
        quizzesCollection,
        where('ownerId', '==', user.uid)
      );

      return collectionData(userQuery, { idField: 'id' }).pipe(
        switchMap((quizzes) => {
          if (!quizzes.length) return of([]);

          const quizzesWithCount$ = quizzes.map((quiz: any) => {
            const questionsCollection = collection(
              this.firestore,
              `quizzes/${quiz.id}/questions`
            );
            return collectionData(questionsCollection).pipe(
              map((questions) => ({
                ...quiz,
                questionsCount: questions.length,
              }))
            );
          });

          return combineLatest(quizzesWithCount$);
        }),
        map(quizzes => quizzes as Quiz[]),
        tap(quizzes => console.log('Quizzes loaded:', quizzes))
      ) as Observable<Quiz[]>;
    })
  );
}

  getById(id: string): Observable<Quiz> {
    const quizDoc = doc(this.firestore, 'quizzes', id);
    return docData(quizDoc, { idField: 'id' }).pipe(
      switchMap((quiz) => {
        if (!quiz) throw new Error('Quiz not found');
        return this.assembleQuiz(quiz as Quiz);
      })
    ) as Observable<Quiz>;
  }

  private assembleQuiz(quiz: Quiz): Observable<Quiz> {
    const questionsCollection = collection(
      this.firestore,
      `quizzes/${quiz.id}/questions`
    );

    return collectionData(questionsCollection, {
      idField: 'id',
    }).pipe(
      map((questions) => ({
        ...quiz,
        questions: questions as Question[],
      }))
    );
  }

  async addQuiz(quiz: Quiz): Promise<void> {
    const user = await firstValueFrom(this.authService.getConnectedUser());
    if (!user) return;

    const batch = writeBatch(this.firestore);
    quiz.ownerId = user.uid;
    const quizId = this.generateQuizId();
    const quizRef = doc(this.firestore, 'quizzes', quizId);

    batch.set(quizRef, {
      title: quiz.title,
      description: quiz.description,
      ownerId: user.uid,
    });

    for (const question of quiz.questions) {
      const questionId = this.generateQuestionId(quizId);
      const questionRef = doc(
        this.firestore,
        `quizzes/${quizId}/questions/${questionId}`
      );

      batch.set(questionRef, {
        text: question.text,
        correctChoiceIndex: question.correctChoiceIndex,
        choices: question.choices,
      });
    }

    await batch.commit();
  }

  async updateQuiz(updatedQuiz: Quiz): Promise<void> {
    const quizRef = doc(this.firestore, 'quizzes', updatedQuiz.id);
    const batch = writeBatch(this.firestore);
    
    batch.update(quizRef, {
      title: updatedQuiz.title,
      description: updatedQuiz.description,
    });

    await batch.commit();
  }

  deleteQuiz(quizId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'quizzes', quizId));
  }

  generateQuizId(): string {
    return doc(collection(this.firestore, 'quizzes')).id;
  }

  generateQuestionId(quizId: string): string {
    return doc(
      collection(this.firestore, `quizzes/${quizId}/questions`)
    ).id;
  }

  generateQuiz(): Quiz {
    const quizId = this.generateQuizId();
    const questionId = this.generateQuestionId(quizId);

    return {
      id: quizId,
      title: 'Guess the Capital City',
      description: 'A fun quiz to test your knowledge of world capitals.',
      ownerId: 'placeholder-user-id',
      questions: [
        {
          id: questionId,
          text: 'What is the capital of France?',
          choices: [
            { id: 0, text: 'Paris' },
            { id: 1, text: 'London' },
            { id: 2, text: 'Berlin' },
            { id: 3, text: 'Madrid' },
          ],
          correctChoiceIndex: 0,
        },
      ],
    };
  }

  async setQuiz(quiz: Quiz): Promise<void> {
    const user = await firstValueFrom(this.authService.getConnectedUser());
    if (!user) throw new Error('User not logged in');

    const batch = writeBatch(this.firestore);
    const quizRef = doc(this.firestore, 'quizzes', quiz.id);
    
    batch.set(quizRef, {
      title: quiz.title,
      description: quiz.description,
      ownerId: user.uid,
    });

    for (const question of quiz.questions) {
      const questionRef = doc(
        this.firestore,
        `quizzes/${quiz.id}/questions/${question.id}`
      );

      batch.set(questionRef, {
        text: question.text,
        correctChoiceIndex: question.correctChoiceIndex,
        choices: question.choices,
      });
    }

    await batch.commit();
  }

  generateQuizCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
  
}