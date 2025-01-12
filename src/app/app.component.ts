import { Component, inject, model, ViewEncapsulation } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { startWith } from 'rxjs';

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

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

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterDialog, {
      width: '600px',
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

@Component({
  template: `
    <h2 mat-dialog-title class="create-acc-title">Creează-ți contul</h2>
    <mat-dialog-content>
      <p>
        <mat-form-field>
          <mat-label>Număr de telefon</mat-label>
          <input [formControl]="phoneNumber" matInput />
          @if (phoneNumber.invalid) {
          <mat-error>Incorrect</mat-error>
          }
        </mat-form-field>
      </p>
      <p>
        <mat-form-field class="password">
          <mat-label>Parola</mat-label>
          <input [formControl]="password" matInput />
        </mat-form-field>

          @let pw = pwVal$ | async;

          <mat-error>
            <div [hidden]="!!pw?.match('^(?=.*[A-Z])')">
              At least one uppercase letter.
            </div>
            <div [hidden]="!!pw?.match('(?=.*[a-z])')">
              At least one lowercase letter.
            </div>
            <div [hidden]="!!pw?.match('(.*[0-9].*)')">At least one digit.</div>
            <div [hidden]="!!pw?.match('(?=.*[!@#$%^&*])')">
              At least one special character.
            </div>
            <div [hidden]="pw?.match('.{8,}')">At least 8 characters long.</div>
          </mat-error>
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button cdkFocusInitial>OK</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    CommonModule,
  ],
})
export class RegisterDialog {
  MOBILE_PATTERN = /^\d{10}$/;
  dialogRef = inject(MatDialogRef<RegisterDialog>);
  phoneNumber = new FormControl('', [Validators.pattern(this.MOBILE_PATTERN)]);
  password = new FormControl<string>('', {
    validators: [Validators.required, Validators.pattern(StrongPasswordRegx)],
  });
  pwVal$ = this.password.valueChanges.pipe(startWith(''))
}
