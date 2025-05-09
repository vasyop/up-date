import {
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { StateService } from './state.service';

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
    CommonModule,
  ],
})
export class SettingsDialog {
  dialogRef = inject(MatDialogRef<SettingsDialog>);
  state = inject(StateService);
  initialName = this.state.user$.value?.name ?? '';
  name = new FormControl(this.initialName);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {}
  ) {

  }

  close() {
    if(!this.state.user$.value) {
      return;
    }

    if(this.name.value) {
      this.state.user$.next({... this.state.user$.value, name: this.name.value});
    }

    this.dialogRef.close();
  }
}
