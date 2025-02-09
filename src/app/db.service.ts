import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  // TODO: actually implement this
  userName$ = new BehaviorSubject('Ana-Maria');

  constructor() {
  }
}
