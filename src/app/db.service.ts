import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

type Permission = "multiple-categories";
type Sub = "user" | "plus" | "admin";

const permissions: Record<Sub, Permission[]> = {
  user: [],
  plus: ["multiple-categories"],
  admin: [],
};

interface User {
  phone: string;
  name: string;
  sub: Sub;
}

interface Questionnaire {
  id: string;
  title: string;
  category: Category[];
}

interface Category {
  name?: string;
  questions: Question[];
}

interface SelectQuestion {
  type: "select";
  multipleChoiceInfo?: {
    multipleChoicePermissionsRequired?: Permission[];
  },
  openAnswerInfo?: {
    text: string;
  }
}

interface OrderQuestion {
  type: "order";
}

type Question = {
  text: string;
  options: string[];
} & (SelectQuestion | OrderQuestion);

const questionnaire: Questionnaire = {
  id: "chestionar-1",
  title: "Persoane cu afectiuni medicale",
  category: [
    {
      questions: [
        {
          text: "În ce categorie te încadrezi?",
          type: "select",
          options: [
            "Persoane cu afecțiuni medicale",
            "Persoane văduve",
            "Persoane singure",
            "Persoane divorțate",
            "Persoane 55 ani +",
            "Persoane celebre",
          ],
        },
        {
          text: "Din ce categorie preferi să fie partenerul/partenera?",
          type: "select",
          options: [
            "Persoane cu afecțiuni medicale",
            "Persoane văduve",
            "Persoane singure",
            "Persoane divorțate",
            "Persoane 55 ani +",
            "Persoane celebre",
          ],
          multipleChoiceInfo: {
            multipleChoicePermissionsRequired: ["multiple-categories"],
          }
        },
      ],
    },
    {
      name: "Informații generale",
      questions: [
        {
          type: "select",
          text: "Ești:",
          options: ["bărbat", "femeie"],
        },
        {
          type: "select",
          text: "Ce cauți pe această platformă?",
          openAnswerInfo: {
            text: 'Alt răspuns'
          },
          options: [
            "O relație serioasă",
            "Prietenie și susținere emoțională",
            "O conexiune fără presiune",
            "Aventura",
            "Încă nu stiu",
          ],
        },
        {
          text: "În ce interval de vârstă te situezi?",
          type: "select",
          options: [
            "18-25 ani",
            "26-35 ani",
            "36-45 ani",
            "46+ ani",
            "55+ ani",
            "65+ ani",
          ],
        },
        {
          text: "În ce interval de vârstă îți dorești un partener?",
          type: "select",
          options: [
            "18-25 ani",
            "26-35 ani",
            "36-45 ani",
            "46+ ani",
            "55+ ani",
            "65+ ani",
          ],
        },
        {
          text: "Ce este important pentru tine într-o relație? Ordonează după importanță.",
          type: "order",
          options: [
            "<strong>Comunicare și sinceritate</strong>: „Este esențial să putem vorbi deschis și sincer.”",
            "<strong>Respect și încredere</strong>: „Respectul și încrederea sunt fundamentale.”",
            "<strong>Sprijin emoțional</strong>: „Vreau un partener care mă susține și mă înțelege.”",
            "<strong>Compromisuri și echilibru</strong>: „Este important să facem compromisuri și să ne respectăm.”",
            "<strong>Afecțiune și timp împreună</strong>: „Gesturile mici de afecțiune și timpul petrecut împreună sunt esențiale.”",
          ],
        },
      ],
    },
  ],
};


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
