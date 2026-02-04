import { Injectable } from '@angular/core';
import { Quiz } from '../models/quiz';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private quizzesm: Quiz[] = [

   {
      id: 'quiz-1',
      title: 'Angular Basics',
      description: 'Quiz sur les bases d’Angular',
      questions: [
        {
          id: 'q-1',
          text: 'Angular est développé par ?',
          choices: [
            { id: 1 , text: 'Facebook' },
            { id: 2, text: 'Google' },
            { id: 3, text: 'Microsoft' },
          ],
          correctChoiceId: 2,
        },],
      }
  ];
  constructor() {}
  quizzes = new BehaviorSubject<Quiz[]>(this.quizzesm);

  getAll(): Observable<Quiz[]> {
    return this.quizzes.asObservable();
  }
  
   get(quizId: string): Promise<Quiz> {
    const quiz = this.quizzes.value.find(q => q.id === quizId);
    return quiz
      ? Promise.resolve({ ...quiz })
      : Promise.reject('Quiz not found');
  }

  addQuiz(quiz: Quiz): Promise<Quiz>{
    this.quizzes.next([...this.quizzes.value, quiz]);
    return Promise.resolve(quiz);
  }

   updateQuiz(updatedQuiz: Quiz): Promise<Quiz> {
    this.quizzes.next(this.quizzes.value.map(q =>
      q.id === updatedQuiz.id ? updatedQuiz : q
    ));
    return Promise.resolve(updatedQuiz);
  }

   deleteQuiz(quizId: string): Promise<void> {
    this.quizzes.next(this.quizzes.value.filter(q => q.id !== quizId));
    return Promise.resolve();
  }

}