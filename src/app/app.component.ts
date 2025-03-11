import {
  Component,
  inject,
  isDevMode,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';
import { DIAG_WIDTH, RegisterDialog } from './register-dialog.component';
import { UserStatusComponent } from './user-status.component';
import { SideSectionComponent } from './side-section.component';
import {
  Answer,
  DbService,
  OTHER_OPTION_ID,
  permissions,
  Questionnaire,
  questionnaire1,
  SelectQuestion,
  user1,
} from './db.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

export enum SIDE_SECTION {
  QUESTIONAIRES = 'Chestionare',
  COMPATIBILITIES = 'Compatibilități',
  SUBS = 'Abonamente',
  OTHER = 'Altele',
}

export type IMainContent = null | ICompatibilityContent | IQuestionnaireContent;

export type IQuestionnaireContent = {
  type: 'questionnaire';
  q: Questionnaire;
  qIndex: number;
};

type ICompatibilityContent = {
  type: 'compatibility';
  reasons: Array<{ title: string; text: string }>;
  personId: string;
  personName: string;
};

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatSidenavModule,
    UserStatusComponent,
    SideSectionComponent,
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
  providers: [provideNativeDateAdapter()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  SIDE_SECTION = SIDE_SECTION;
  OTHER_OPTION_ID = OTHER_OPTION_ID;
  page$ = new BehaviorSubject<'regLog' | 'about' | 'dashboard'>('regLog');
  mainContent$ = new BehaviorSubject<IMainContent>(null);
  dialog = inject(MatDialog);
  db = inject(DbService);
  date = new FormControl(new Date());
  time = new FormControl(
    (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    })()
  );

  questionnaires$ = this.db.questionnaires$.pipe(
    map((links) => links.map((l) => ({ title: l, id: l })))
  );
  compatibilities$ = this.db.compatibilities$.pipe(
    map((comps) => comps.map((c) => ({ title: c, id: c })))
  );

  ngAfterContentInit() {
    this.page$.subscribe(() => {
      window.scrollTo(0, 0);
    });

    setTimeout(() => {
      this.initMap();
    }, 500);

    setTimeout(() => {
      this.page$.next('dashboard'); // TODO: remove this
      this.handleLinkClick(
        SIDE_SECTION.QUESTIONAIRES,
        this.db.questionnaires$.value[0]
      ); // TODO: remove this
    }, 1000);
  }

  openRegisterDialog(type: 'login' | 'register'): void {
    this.dialog.open(RegisterDialog, {
      panelClass: 'register-dialog',
      width: DIAG_WIDTH,
      data: {
        type,
      },
    });
  }

  pageClasses(page: string | null) {
    return {
      about: page === 'about',
      'reg-log': page === 'regLog',
      dashboard: page === 'dashboard',
    };
  }

  handleLinkClick(section: SIDE_SECTION, linkId: string) {
    console.log(`Section: ${section}, Link clicked: ${linkId}`);

    if (section === SIDE_SECTION.COMPATIBILITIES && linkId === 'Gigi Becali') {
      this.mainContent$.next({
        type: 'compatibility',
        reasons: [
          {
            title: 'Valorile Profunde și Credința Religioasă',
            text: 'Gigi Becali este un om profund religios, iar acest aspect este definitoriu pentru viața lui. O persoană compatibilă cu el trebuie să împărtășească această credință profundă în Dumnezeu, să respecte valorile ortodoxe și să fie deschisă către un stil de viață centrat pe credință. Dacă ești o femeie care își începe ziua cu rugăciunea, care respectă sărbătorile religioase și care consideră Biserica un punct de referință în viață, atunci ai deja un punct comun esențial cu el.',
          },
          {
            title: 'Respectul pentru Tradiție și Familie',
            text: 'Pentru Gigi Becali, familia este cel mai important pilon al vieții sale. O femeie compatibilă cu el trebuie să aibă o viziune similară asupra căsătoriei, să creadă în rolurile tradiționale și să fie devotată ideii de familie unită. Dacă ești o persoană care prețuiește valorile tradiționale, îți dorești un partener protector și un sprijin puternic pentru întemeierea unei familii, atunci această compatibilitate poate deveni o poveste de succes.',
          },
          {
            title: 'Puterea de a Fi Loială și Devotată',
            text: 'Loialitatea este un principiu de bază pentru Gigi Becali, atât în afaceri, cât și în viața personală. O relație cu el necesită devotament și o atitudine de susținere necondiționată. Dacă ești o persoană care apreciază stabilitatea, care nu este atrasă de conflicte sau schimbări bruște și care își respectă partenerul cu strictețe, vei găsi în el un om care apreciază și răsplătește aceste calități',
          },
          {
            title: 'Acceptarea Unui Stil de Viață Luxos, Dar cu Regulile Lui',
            text: 'Gigi Becali este un om de afaceri de succes, iar viața sa reflectă acest lucru printr-un stil opulent. Însă, el nu promovează excesele și pune preț pe decență. Dacă ești o femeie care știe să aprecieze luxul, dar care nu este definită de materialism, vei reuși să te integrezi armonios în stilul său de viață. O atitudine de respect față de resurse și o viziune moderată asupra cheltuielilor sunt esențiale pentru a avea o relație echilibrată cu el.',
          },
        ],
        personId: linkId,
        personName: linkId,
      });
    } else if (section === SIDE_SECTION.QUESTIONAIRES) {
      this.mainContent$.next({
        type: 'questionnaire',
        q: questionnaire1,
        qIndex: 0,
      });
    } else {
      this.mainContent$.next(null);
    }
  }

  navQuestion(inc: number, current: IQuestionnaireContent) {
    const newIndex = current.qIndex + inc;
    if (newIndex < 0 || newIndex >= this.totalQuestions(current)) {
      return;
    }

    this.mainContent$.next({
      ...current,
      qIndex: newIndex,
    });
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

  hasOpenAnswer() {
    const content = this.mainContent$.value;
    if (!content || content.type !== 'questionnaire') {
      return false;
    }

    const q = this.getQuestion(content);
    if (!q) {
      return false;
    }

    return !!this.myUserAnswers().find(
      (a) => a.qId === q.id && a.oId === OTHER_OPTION_ID
    );
  }

  myUserAnswers() {
    return this.db.answers$.value.filter((a) => a.uId === user1.phone);
  }

  getOptionValue(optId: string) {
    const content = this.mainContent$.value;
    if (!content || content.type !== 'questionnaire') {
      return;
    }

    const q = this.getQuestion(content);
    if (!q) {
      return;
    }

    const a = this.myUserAnswers().find((a) => a.qId === q.id && a.oId === optId);
    return a?.value ?? false;
  }

  val(el: EventTarget | null) {
    if (el instanceof HTMLTextAreaElement) return el.value;

    return '';
  }

  saveAnswer(oId: string, value: boolean | string) {
    const content = this.mainContent$.value;
    if (!content || content.type !== 'questionnaire') {
      return;
    }

    const q = this.getQuestion(content);
    if (!q || q.type !== 'select') {
      return;
    }

    const multiple = this.isAllowedMultipleChoiceAnswer(q);

    if (multiple) {
      const a = this.myUserAnswers().find((a) => a.qId === q.id && a.oId === oId);
      if (a) {
        a.value = value;
        this.db.answers$.next(this.db.answers$.value);
      } else {
        this.db.answers$.next([
          ...this.db.answers$.value,
          {
            uId: user1.phone,
            qId: q.id,
            oId,
            value,
          }
        ])
      }
    } else {
      const arr: Answer[] = [{
        uId: user1.phone,
        qId: q.id,
        oId,
        value,
      }];

      for(const a of this.db.answers$.value) {
        if(a.uId !== user1.phone || a.qId !== q.id) {
          arr.push(a);
        }
      }

      this.db.answers$.next(arr);
    }
  }

  isAllowedMultipleChoiceAnswer(q: SelectQuestion) {
    return !!q.multipleChoiceInfo?.multipleChoicePermissionsRequired?.every(
      (p) => permissions[this.db.user$.value.sub].includes(p)
    );
  }

  totalQuestions({ q }: IQuestionnaireContent) {
    return q.categories.reduce((acc, cat) => acc + cat.questions.length, 0);
  }

  questionAnswerChange(qid: string, oId: string, val: boolean | string) {
    // todo: if single choice, remove uid|qid|* entries from table
    // todo: remove uid|qid|optId triplet from table
    // todo: add uid|qid|optId|val to table with val val
  }

  picked() {
    setTimeout(() => {
      console.log(
        'Date picked:',
        this.date.value!.getMonth() + 1 + '/' + this.date.value?.getDate()
      );
      console.log(
        'Time picked:',
        this.time.value!.getHours() + ':' + this.time.value?.getMinutes()
      );
    });
  }

  handleSectionButtonClick(section: SIDE_SECTION) {
    console.log(`Section: ${section}, Button clicked`);
  }

  initMap() {
    const mapboxgl = (window as any).mapboxgl;

    mapboxgl.accessToken =
      'pk.eyJ1IjoidmFzeW9wIiwiYSI6ImNqNW1yMnd4YzNvbXEyd284cGVxbnQ1bjYifQ.jMhtbSEu9PsLlBoikZrVjg';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [70, 45],
      zoom: 3,
    });

    map.scrollZoom.disable();

    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker(el).setLngLat([25, 46.5]).addTo(map);

    let dragging = false;
    map.on('mousedown', () => {
      dragging = true;
    });

    map.on('mouseup', () => {
      dragging = false;
    });

    pan();

    function pan() {
      const duration = 10;
      const deltaDistance = 10;

      function easing(t: number) {
        return t * (2 - t);
      }

      if (!dragging) {
        map.panBy([-deltaDistance, 0], {
          easing,
        });
      }

      setTimeout(pan, duration);
    }
  }
}
