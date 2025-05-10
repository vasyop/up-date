import { ErrorHandler, inject, Injector } from "@angular/core";
import {
  MatSnackBar,
} from '@angular/material/snack-bar';

export class MyErrorHandler implements ErrorHandler {
  private _injector = inject(Injector);

  handleError(error: any) {
    this._injector.get(MatSnackBar).open(error.message, 'OK', {
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'error-snackbar',
    });
  }
}
