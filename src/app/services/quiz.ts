import { inject, Injectable } from '@angular/core';
import { Quiz } from '../models/quiz';
import { Question } from '../models/question';
import {
  Firestore,
  collection,
  collectionData,
  collectionCount,
  doc,
  docData,
  query,
  where,
  writeBatch,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable, of, switchMap, map, combineLatest, mergeMap, tap, firstValueFrom } from 'rxjs';
import { AuthService } from './auth';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);


 getAll(): Observable<Quiz[]> {
  const quizzesCollection = collection(this.firestore, 'quizzes');

  return this.authService.getConnectedUser().pipe(
    switchMap((user) => {
      if (!user) return of([]);

      const userQuery = query(
        quizzesCollection,
        where('ownerId', '==', user.uid)
      );

      return (collectionData(userQuery, { idField: 'id' }) as Observable<Quiz[]>).pipe(
        switchMap((quizzes) => {
          if (quizzes.length === 0) return of([]);

          return combineLatest(
            quizzes.map((quiz) =>
              collectionCount(
                collection(this.firestore, `quizzes/${quiz.id}/questions`)
              ).pipe(
                map((count) => ({
                  ...quiz,
                  questionsCount: count,
                }))
              )
            )
          );
        })
      );
    })
  );
}
  getById(id: string): Observable<Quiz> {
    const quizDoc = doc(this.firestore, `quizzes/${id}`);

    return (docData(quizDoc, { idField: 'id' }) as Observable<Quiz>).pipe(
      switchMap((quiz) => this.assembleQuiz(quiz)),
      tap(console.log)
    );
  }

  private assembleQuiz(quiz: Quiz): Observable<Quiz> {
    const questionsCollection = collection(
      this.firestore,
      `quizzes/${quiz.id}/questions`
    );

    return (collectionData(questionsCollection, {
      idField: 'id',
    }) as Observable<Question[]>).pipe(
      map((questions) => ({
        ...quiz,
        questions,
      }))
    );
  }


  async addQuiz(quiz: Quiz): Promise<void> {
    const user = await firstValueFrom(this.authService.getConnectedUser());
    if (!user) return;

    const batch = writeBatch(this.firestore);quiz.ownerId = user.uid;
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
        correctChoiceIndex: question.correctChoiceId,
        choices: question.choices,
      });
    }

    await batch.commit();
  }

  async updateQuiz(updatedQuiz: Quiz): Promise<void> {
    const quizRef = doc(this.firestore, `quizzes/${updatedQuiz.id}`);

    const batch = writeBatch(this.firestore);

    batch.update(quizRef, {
      title: updatedQuiz.title,
      description: updatedQuiz.description,
    });

    await batch.commit();
  }

  deleteQuiz(quizId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `quizzes/${quizId}`));
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
          correctChoiceId: 0,
        },
      ],
    };
  }

 async setQuiz(quiz: Quiz): Promise<void> {
  const user = await firstValueFrom(this.authService.getConnectedUser());
  if (!user) throw new Error('User not logged in');

  const batch = writeBatch(this.firestore);

  // Add ownerId to the main quiz document
  const quizRef = doc(this.firestore, 'quizzes', quiz.id);
  batch.set(quizRef, {
    title: quiz.title,
    description: quiz.description,
    ownerId: user.uid,  // <-- this line adds the owner
  });

  // Save questions as before
  for (const question of quiz.questions) {
    const questionRef = doc(
      this.firestore,
      `quizzes/${quiz.id}/questions/${question.id}`
    );

    batch.set(questionRef, {
      text: question.text,
      correctChoiceIndex: question.correctChoiceId,
      choices: question.choices,
    });
  }

  await batch.commit();
}

 

}