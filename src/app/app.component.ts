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
import { DbService } from './db.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';

export enum SIDE_SECTION {
  QUESTIONAIRES = 'Chestionare',
  COMPATIBILITIES = 'Compatibilități',
  SUBS = 'Abonamente',
  OTHER = 'Altele',
}

export type IMainContent = null | ICompatibilityContent;

type ICompatibilityContent = {
  type: 'compatibility';
  reasons: Array<{ title: string; text: string }>;
  personId: string;
  personName: string;
  date: Date;
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
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  SIDE_SECTION = SIDE_SECTION;
  page$ = new BehaviorSubject<'regLog' | 'about' | 'dashboard'>('regLog');
  mainContent$ = new BehaviorSubject<IMainContent>(null);
  dialog = inject(MatDialog);
  db = inject(DbService);

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
      this.handleLinkClick(SIDE_SECTION.COMPATIBILITIES, 'Gigi Becali'); // TODO: remove this
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
        date: new Date(),
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
    } else {
      this.mainContent$.next(null);
    }
  }

  onDatePicked(date: Date, content: ICompatibilityContent) {
    this.mainContent$.next({
      ...content,
      date,
    })
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
