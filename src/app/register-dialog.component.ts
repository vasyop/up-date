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

const INIT_NR = isDevMode() ? '0749511223' : '';
const INIT_PW = isDevMode() ? '#$KLJ#j*fE8' : '';
export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  templateUrl: './register-dialog.component.html',
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
