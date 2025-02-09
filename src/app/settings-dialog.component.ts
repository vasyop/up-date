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
import { DbService } from './db.service';

@Component({
  templateUrl: './settings-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './settings-dialog.component.scss',
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
export class SettingsDialog {
  dialogRef = inject(MatDialogRef<SettingsDialog>);
  db = inject(DbService);
  initialName = this.db.userName$.value;
  name = new FormControl(this.initialName);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {}
  ) {

  }

  close() {
    if(!this.name.value) {
      this.db.userName$.next(this.initialName);
    } else {
      this.db.userName$.next(this.name.value);
    }

    this.dialogRef.close();
  }
}
