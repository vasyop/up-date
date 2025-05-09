import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../backend/src/types';
import { Answer, questionnaire1 } from '../../backend/src/types';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  page$ = new BehaviorSubject<'regLog' | 'about' | 'dashboard'>('regLog');
  user$ = new BehaviorSubject<User | null>(null);
  answers$ = new BehaviorSubject<Answer[]>([]);

  questionnaires$ = new BehaviorSubject([questionnaire1]);

  constructor() {
    // TODO: this will surely break once the model changes
    if (localStorage.getItem('answers')) {
      this.answers$.next(JSON.parse(localStorage.getItem('answers')!));
    }
    this.answers$.subscribe((answers) => {
      localStorage.setItem('answers', JSON.stringify(answers));
    });
  }
}
