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
  SelectAnswer,
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
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-questionnaire',
  imports: [
    CdkDropList,
    CdkDrag,
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
      (a) => a.type === 'select' && a.qId === q.id && a.oId === optId && a.uId === user1.phone
    );

    if(a?.type === 'select') {
      return a.value;
    }

    if(q.type === 'select' && !q.multipleChoiceInfo && q.openAnswerInfo && !q.options.length) {
      return '';
    }

    return undefined;
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

    const currentheckedOptionAnswer = (a: Answer) => a.type === 'select' && a.uId === user1.phone && a.qId === q.id && a.oId === oId

    if(value === false) {
      this.db.answers$.next(this.db.answers$.value.filter((a) => !currentheckedOptionAnswer(a)));
      return;
    }

    if (this.isAllowedMultipleChoiceAnswer(q)) {
      this.db.answers$.next([
        ...this.db.answers$.value.filter((a) => !currentheckedOptionAnswer(a)),
        {
          type: 'select',
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
          type: 'select',
          uId: user1.phone,
          qId: q.id,
          oId,
          value,
        }
      ]);
    }
  }

  reorder(event: CdkDragDrop<string[]>) {
    const q = this.getQuestion(this.content);
    if (!q || q.type !== 'order') {
      return;
    }

    const newOrder = this.currentOrder(q);
    moveItemInArray(newOrder, event.previousIndex, event.currentIndex);

    const ans = this.db.answers$.value.find((a) => a.type === 'order' && a.uId === user1.phone && a.qId === q.id);
    if(ans?.type === 'order') {
      ans.order = newOrder;
      this.db.answers$.next(this.db.answers$.value.filter((a) => a !== ans).concat([ans]));
    } else {
      this.db.answers$.next(this.db.answers$.value.concat([{
        type: 'order',
        uId: user1.phone,
        qId: q.id,
        order: newOrder,
      }]));
    }
  }

  currentOrder(q: Question) {
    const ans = this.db.answers$.value.find((a) => a.type === 'order' && a.uId === user1.phone && a.qId === q.id);
    return ans?.type === 'order' ? ans.order : q.options.map((o) => o.id);
  }

  findText(q: Question, id: string) {
    return q.options.find((o) => o.id === id)?.text;
  }

  findFirstSelectAnswer(q: Question) {
    const ans = this.db.answers$.value.find((a) => a.uId === user1.phone && a.qId === q.id)
    if(ans?.type === 'select') {
      return ans;
    }
    return undefined;
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
