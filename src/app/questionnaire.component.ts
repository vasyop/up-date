import { Component, inject, Input } from '@angular/core';
import { IQuestionnaireContent } from './dashboard.component';
import {
  Answer,
  SelectQuestion,
  OTHER_OPTION_ID,
  permissions,
  user1,
  DbService,
  Question,
} from './db.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-questionnaire',
  imports: [
    MatSelectModule,
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatSidenavModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatTimepickerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  templateUrl: './questionnaire.component.html',
})
export class QuestionnaireComponent {
  @Input() content!: IQuestionnaireContent;

  db = inject(DbService);
  OTHER_OPTION_ID = OTHER_OPTION_ID;

  navQuestion(inc: number, current: IQuestionnaireContent) {
    const newIndex = current.qIndex + inc;
    if (newIndex < 0 || newIndex >= this.totalQuestions(current)) {
      return;
    }

    this.content.qIndex = newIndex;
  }

  getQuestion({ q, qIndex }: IQuestionnaireContent) {
    let i = 0;
    for (const cat of q.categories) {
      for (const q of cat.questions) {
        if (i === qIndex) {
          return q;
        }
        i++;
      }
    }

    return null;
  }

  getSectionTitle({ q, qIndex }: IQuestionnaireContent) {
    let i = 0;
    for (const cat of q.categories) {
      for (const q of cat.questions) {
        if (i === qIndex) {
          return cat.name;
        }
        i++;
      }
    }

    return 'bad index';
  }

  getOptionValue(optId: string) {
    const content = this.content;
    if (!content || content.type !== 'questionnaire') {
      return;
    }

    const q = this.getQuestion(content);
    if (!q) {
      return;
    }

    const a = this.db.answers$.value.find(
      (a) => a.qId === q.id && a.oId === optId && a.uId === user1.phone
    );
    return a?.value;
  }

  val(el: EventTarget | null) {
    if (el instanceof HTMLTextAreaElement) return el.value;

    return '';
  }

  saveAnswer(oId: string, value: boolean | string) { // value false means remove answer entry
    if (!this.content || this.content.type !== 'questionnaire') {
      return;
    }

    const q = this.getQuestion(this.content);
    if (!q || q.type !== 'select') {
      return;
    }

    if(value === false) {
      this.db.answers$.next(this.db.answers$.value.filter((a) => !(a.uId === user1.phone && a.oId === oId && a.qId === q.id)));
      return;
    }

    if (this.isAllowedMultipleChoiceAnswer(q)) {
      this.db.answers$.next([
        ...this.db.answers$.value.filter((a) => !(a.uId === user1.phone && a.qId === q.id && a.oId === oId)),
        {
          uId: user1.phone,
          qId: q.id,
          oId,
          value,
        }
      ]);

    } else {
      this.db.answers$.next([
        ...this.db.answers$.value.filter((a) => !(a.uId === user1.phone && a.qId === q.id)),
        {
          uId: user1.phone,
          qId: q.id,
          oId,
          value,
        }
      ]);
    }
  }

  findFirstAnswer(q: Question) {
    return this.db.answers$.value.find((a) => a.uId === user1.phone && a.qId === q.id)
  }

  isAllowedMultipleChoiceAnswer(q: SelectQuestion) {
    return !!q.multipleChoiceInfo?.multipleChoicePermissionsRequired?.every(
      (p) => permissions[this.db.user$.value.sub].includes(p)
    );
  }

  totalQuestions({ q }: IQuestionnaireContent) {
    return q.categories.reduce((acc, cat) => acc + cat.questions.length, 0);
  }
}
