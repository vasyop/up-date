import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  // TODO: actually implement this
  userName$ = new BehaviorSubject('Ana-Maria');

  questionnaires$ = new BehaviorSubject(['Persoane cu afecțiuni medicale', 'Persoane văduve/divorțate/cu copii/singure', 'Persoane celebre/influenceri']);
  compatibilities$ = new BehaviorSubject(['Gigi Becali', 'Florin Citu', 'Ana Blandiana']);

  constructor() {}
}
