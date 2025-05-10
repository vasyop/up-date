import {
  Component,
  inject,
  isDevMode,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { Inject } from '@angular/core';
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
import { User } from '../../backend/src/types';
import { StateService } from './state.service';

const isDev = isDevMode();

export const DIAG_WIDTH = '600px';
const INIT_NR = isDev ? '0749511223' : '';
const INIT_TERMS = false;
const INIT_CODE = isDev ? '12345' : '';
const INIT_PRIVACY = false;
const INIT_PW = isDev ? '#$KLJ#j*fE8' : '';
export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  templateUrl: './register-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './register-dialog.component.scss',
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
  dialog = inject(MatDialog);
  state = inject(StateService);
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
  PHONE_STATES = ['register', 'login', 'reset'];
  PASSWORD_VALIDATION_STATES = ['register', 'code'];
  PASSWORD_STATES = [...this.PASSWORD_VALIDATION_STATES, 'login'];
  DIAG_TITLE = {
    login: 'Conectează-te',
    register: 'Creează-ți contul',
    reset: 'Resetare parola',
    code: 'Introdu codul primt pe SMS și noua parola',
  };
  MOBILE_PATTERN = /^\d{10}$/;
  dialogRef = inject(MatDialogRef<RegisterDialog>);
  phoneNumber = new FormControl(INIT_NR);
  password = new FormControl<string>(INIT_PW);
  terms = new FormControl(INIT_TERMS);
  code = new FormControl(INIT_CODE, {validators: [Validators.required]});
  privacy = new FormControl(INIT_PRIVACY);
  pwVal$ = this.password.valueChanges.pipe(startWith(INIT_PW));
  pnVal$ = this.phoneNumber.valueChanges.pipe(startWith(INIT_NR));
  okEnabled$ = combineLatest([
    this.code.valueChanges.pipe(
      startWith(INIT_CODE),
      map(
        () =>
          (this.data.type === 'code' && !!this.code.value) ||
          this.data.type !== 'code'
      )
    ),
    this.terms.valueChanges.pipe(
      startWith(INIT_TERMS),
      map((checked) => !!checked || this.data.type !== 'register')
    ),
    this.privacy.valueChanges.pipe(
      startWith(INIT_PRIVACY),
      map((checked) => !!checked || this.data.type !== 'register')
    ),
    this.phoneNumber.valueChanges.pipe(
      startWith(INIT_NR),
      map(
        (val) =>
          !this.PHONE_STATES.includes(this.data.type) ||
          !!val?.match(this.MOBILE_PATTERN)
      )
    ),
    this.pwVal$.pipe(
      map((pw) =>
        this.passwordChecks.every(
          (check) =>
            (this.PASSWORD_VALIDATION_STATES.includes(this.data.type) && this.isValid(pw, check.regexp)) ||
            (this.data.type === 'login' && !!pw) ||
            !this.PASSWORD_STATES.includes(this.data.type)
        )
      )
    ),
  ]).pipe(map((arr) => arr.every((x) => x)));

  public isValid(pw: string | null, regexp: string) {
    return !!pw?.match(regexp);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: 'login' | 'register' | 'reset' | 'code';
    }
  ) {}

  public navigateToReset() {
    this.dialogRef.close();
    this.dialog.open(RegisterDialog, {
      panelClass: 'register-dialog',
      width: DIAG_WIDTH,
      data: {
        type: 'reset',
      },
    });
  }

  async submit() {
    if (this.data.type === 'reset') {
      this.navigateToCode();
    }

    if (this.data.type === 'register') {
      const user: Omit<User, 'sub'> = {
        phone: this.phoneNumber.value!,
        password: this.password.value!,
        name: this.phoneNumber.value!,
      };

      const res = await fetch('http://localhost:3000/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if(res.status === 201) {
        this.login(user.phone, user.password);
      } else {
        const { message } = await res.json();
        throw new Error(message);
      }
    }

    if (this.data.type === 'login') {
      this.login(this.phoneNumber.value!, this.password.value!);
    }
  }

  navigateToCode() {
    this.dialogRef.close();
    this.dialog.open(RegisterDialog, {
      panelClass: 'register-dialog',
      width: DIAG_WIDTH,
      data: {
        type: 'code',
      },
    });
  }

  async login(phone: string, password: string) {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, password }),
    });

    const json = await res.json();
    console.log(json)

    if(res.status === 200) {
      const { user } = json;
      this.state.user$.next(user);
      this.dialogRef.close();
      this.state.page$.next('dashboard');
    } else {
      throw new Error(json.message);
    }
  }
}
