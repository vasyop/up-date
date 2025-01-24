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

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
const INIT_NR = isDevMode() ? '0749511223' : '';
const INIT_PW = isDevMode() ? '#$KLJ#j*fE8' : '';
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

@Component({
  template: `
    <h2 mat-dialog-title class="create-acc-title">Creează-ți contul</h2>

    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Număr de telefon</mat-label>
        <input [formControl]="phoneNumber" matInput cdkFocusInitial />
        @if (phoneNumber.invalid) {
        <mat-error>Incorrect</mat-error>
        }
      </mat-form-field>

      <mat-form-field class="password">
        <mat-label>Parola</mat-label>
        <input [formControl]="password" matInput />
      </mat-form-field>

      @let pw = pwVal$ | async; @let allValid = allValid$ | async;

      <mat-error>
        @for (check of passwordChecks; track check.regexp) {
        <div>
          @if (isValid(pw, check.regexp)) {
          <span class="line green">
            <mat-icon>check</mat-icon> {{ check.message }}
          </span>
          } @if (!isValid(pw, check.regexp)) {
          <span class="line">
            <mat-icon>cancel</mat-icon> {{ check.message }}
          </span>
          }
        </div>
        }
      </mat-error>

      <mat-checkbox class="first" [formControl]="privacy">
        Am citit și sunt de acord cu
        <a href="#"> Politica de confidențialitate </a>
      </mat-checkbox>

      <mat-checkbox [formControl]="terms">
        Am citit și sunt de acord cu
        <a href="#"> Termenii și condițiile </a>
      </mat-checkbox>

    </mat-dialog-content>

    <mat-dialog-actions>
      <button [disabled]="!allValid" mat-button>OK</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    CommonModule,
  ],
})
export class RegisterDialog {
  passwordChecks = [
    {
      regexp: '^(?=.*[A-Z])',
      message: 'Cel puțin o literă mare.',
    },
    {
      regexp: '(?=.*[a-z])',
      message: 'Cel puțin o literă mică.',
    },
    {
      regexp: '(.*[0-9].*)',
      message: 'Cel puțin o cifră.',
    },
    {
      regexp: '(?=.*[!@#$%^&*])',
      message: 'Cel puțin un caracter special (!@#$%^&*).',
    },
    {
      regexp: '.{8,}',
      message: 'Cel puțin 8 caractere.',
    },
  ];

  MOBILE_PATTERN = /^\d{10}$/;
  dialogRef = inject(MatDialogRef<RegisterDialog>);
  phoneNumber = new FormControl(INIT_NR, [
    Validators.pattern(this.MOBILE_PATTERN),
  ]);
  password = new FormControl<string>(INIT_PW, {
    validators: [Validators.required, Validators.pattern(StrongPasswordRegx)],
  });
  terms = new FormControl(false);
  privacy = new FormControl(false);
  pwVal$ = this.password.valueChanges.pipe(startWith(INIT_PW));
  allValid$ = combineLatest([
    this.terms.valueChanges.pipe(map((checked) => !!checked)),
    this.privacy.valueChanges.pipe(map((checked) => !!checked)),
    this.phoneNumber.valueChanges.pipe(
      startWith(INIT_NR),
      map(() => this.phoneNumber.valid)
    ),
    this.pwVal$.pipe(
      map((pw) =>
        this.passwordChecks.every((check) => this.isValid(pw, check.regexp))
      )
    ),
  ]).pipe(map((arr) => arr.every((x) => x)));

  public isValid(pw: string | null, regexp: string) {
    return !!pw?.match(regexp);
  }
}
