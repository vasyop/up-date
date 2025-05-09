import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialog } from './settings-dialog.component';
import { StateService } from './state.service';

@Component({
  templateUrl: './user-status.component.html',
  styleUrl: './user-status.component.scss',
  encapsulation: ViewEncapsulation.None,
  selector: 'user-status',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    CommonModule,
  ],
})
export class UserStatusComponent {
  dialog = inject(MatDialog);
  state = inject(StateService);

  openSettings() {
    this.dialog.open(SettingsDialog, {
      disableClose: true,
      panelClass: 'settings-dialog',
      width: '600px',
      data: {
        type: 'reset',
      },
    });
  }
}
