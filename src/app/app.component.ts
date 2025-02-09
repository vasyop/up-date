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
import {
  MatDialog,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { DIAG_WIDTH, RegisterDialog } from './register-dialog.component';
import { UserStatusComponent } from './user-status.component';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  page$ = new BehaviorSubject<'regLog' | 'about'| 'dashboard'>('regLog');
  dialog = inject(MatDialog);

  ngAfterContentInit() {
    this.page$.subscribe(() => {
      window.scrollTo(0,0)
    });

    setTimeout(() => {
      this.initMap();
    }, 500);

    setTimeout(() => {
      this.page$.next('dashboard'); // TODO: remove this
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
