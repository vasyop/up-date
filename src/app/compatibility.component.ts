import { Component, Input } from '@angular/core';
import { ICompatibilityContent } from './dashboard.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compatibility',
  templateUrl: './compatibility.component.html',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CompatibilityComponent {
  @Input() content!: ICompatibilityContent;
  date = new FormControl(new Date());
  time = new FormControl(
    (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    })()
  );

  picked() {
    setTimeout(() => {
      console.log(
        'Date picked:',
        this.date.value!.getMonth() + 1 + '/' + this.date.value?.getDate()
      );
      console.log(
        'Time picked:',
        this.time.value!.getHours() + ':' + this.time.value?.getMinutes()
      );
    });
  }
}
