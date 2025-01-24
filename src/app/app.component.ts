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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { RegisterDialog } from './register-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  dialog = inject(MatDialog);

  ngAfterContentInit() {
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  openRegisterDialog(type: 'login' | 'register'): void {
    this.dialog.open(RegisterDialog, {
      width: '600px',
      data: {
        type,
      }
    });
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
