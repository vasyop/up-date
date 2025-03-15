import { Component, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DbService,
  OTHER_OPTION_ID,
  Questionnaire,
} from './db.service';
import { CommonModule } from '@angular/common';
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
import { SideSectionComponent } from './side-section.component';
import { UserStatusComponent } from './user-status.component';
import { CompatibilityComponent } from './compatibility.component';
import { QuestionnaireComponent } from './questionnaire.component';

enum SIDE_SECTION {
  QUESTIONAIRES = 'Chestionare',
  COMPATIBILITIES = 'Compatibilități',
  SUBS = 'Abonamente',
  OTHER = 'Altele',
}

type Content = null | ICompatibilityContent | IQuestionnaireContent;

export type IQuestionnaireContent = {
  type: 'questionnaire';
  q: Questionnaire;
  qIndex: number;
};

export type ICompatibilityContent = {
  type: 'compatibility';
  reasons: Array<{ title: string; text: string }>;
  personId: string;
  personName: string;
};

@Component({
  selector: 'app-dashboard',
  imports: [
    CompatibilityComponent,
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
    QuestionnaireComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  SIDE_SECTION = SIDE_SECTION;
  content$ = new BehaviorSubject<Content>(null);
  db = inject(DbService);

  questionnairesTitles$ = this.db.questionnaires$.pipe(
    map((qs) => qs.map((q) => ({ title: q.title, id: q.id })))
  );

  compatibilities = ['Gigi Becali', 'Florin Citu', 'Ana Blandiana'].map(
    (name, i) => ({ title: name, id: i.toString() })
  );

  constructor() {
    setTimeout(() => {
      this.handleLinkClick(SIDE_SECTION.QUESTIONAIRES, this.db.questionnaires$.value[0].id); // TODO: remove this
    }, 100);
  }


  handleLinkClick(section: SIDE_SECTION, linkId: string) {
    console.log(`Section: ${section}, Link clicked: ${linkId}`);

    if (section === SIDE_SECTION.COMPATIBILITIES) {
      const comp = this.compatibilities.find((p) => p.id === linkId);

      if(!comp) {
        return;
      }

      this.content$.next({
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
        personId: comp.id,
        personName: comp.title,
      });
    } else if (section === SIDE_SECTION.QUESTIONAIRES) {
      const q = this.db.questionnaires$.value.find((q) => q.id === linkId);

      if (!q) {
        return;
      }

      this.content$.next({
        type: 'questionnaire',
        q,
        qIndex: 0,
      });

    } else {
      this.content$.next(null);
    }
  }

  handleSectionButtonClick(section: SIDE_SECTION) {
    console.log(`Section: ${section}, Button clicked`);
  }
}
