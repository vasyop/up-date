import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Permission = 'multiple-categories';
type Sub = 'user' | 'plus' | 'admin';

export const permissions: Record<Sub, Permission[]> = {
  user: [],
  plus: ['multiple-categories'],
  admin: ['multiple-categories'],
};

export interface User {
  phone: string;
  name: string;
  sub: Sub;
}

export interface Questionnaire {
  id: string;
  title: string;
  categories: Category[];
}

export interface Category {
  name?: string;
  questions: Question[];
}

export interface SelectQuestion {
  type: 'select';
  multipleChoiceInfo?: {
    multipleChoicePermissionsRequired?: Permission[];
  };
  openAnswerInfo?: {
    text: string;
  };
}
export interface OrderQuestion {
  type: 'order';
}

export type Question = {
  id: string;
  text: string;
  options: Option[]
} & (SelectQuestion | OrderQuestion);

export interface Option {
  id: string
  text: string;
}


export type Answer = {
  uId: string; // user id (phone)
  qId: string; // question id
  oId: '@other' | string; // option id
  value: boolean | string; // string for @other
};

export const user1: User = {
  phone: '0123456789',
  name: 'Ana-Maria',
  sub: 'admin',
};

export const questionnaire1: Questionnaire = {
  id: 'chestionar-1',
  title: 'Persoane cu afectiuni medicale',
  categories: [
    {
      questions: [
        {
          id: 'categorie-eu',
          text: 'În ce categorie te încadrezi?',
          type: 'select',
          options: [
            {
              id: 'Persoane cu afecțiuni medicale',
              text: 'Persoane cu afecțiuni medicale',
            },
            {
              id: 'Persoane văduve',
              text: 'Persoane văduve',
            },
            {
              id: 'Persoane singure',
              text: 'Persoane singure',
            },
            {
              id: 'Persoane divorțate',
              text: 'Persoane divorțate',
            },
            {
              id: 'Persoane 55 ani+',
              text: 'Persoane 55 ani+',
            },
            {
              id: 'Persoane celebre',
              text: 'Persoane celebre',
            },
          ],
        },
        {
          id: 'categorie-partener',
          text: 'Din ce categorie preferi să fie partenerul/partenera?',
          type: 'select',
          options: [
            {
                "id": "Persoane cu afecțiuni medicale",
                "text": "Persoane cu afecțiuni medicale"
            },
            {
                "id": "Persoane văduve",
                "text": "Persoane văduve"
            },
            {
                "id": "Persoane singure",
                "text": "Persoane singure"
            },
            {
                "id": "Persoane divorțate",
                "text": "Persoane divorțate"
            },
            {
                "id": "Persoane 55 ani +",
                "text": "Persoane 55 ani +"
            },
            {
                "id": "Persoane celebre",
                "text": "Persoane celebre"
            }
        ],
          multipleChoiceInfo: {
            multipleChoicePermissionsRequired: ['multiple-categories'],
          },
        },
      ],
    },
    {
      name: 'Informații generale',
      questions: [
        {
          id: 'gen-eu',
          type: 'select',
          text: 'Ești:',
          options: [
            {
              id: 'b',
              text: 'Bărbat',
            },
            {
              id: 'f',
              text: 'Femeie',
            }
          ],
        },
        {
          id: 'scop-acces',
          type: 'select',
          text: 'Ce cauți pe această platformă?',
          openAnswerInfo: {
            text: 'Alt răspuns',
          },
          options: [
            {
                "id": "O relație serioasă",
                "text": "O relație serioasă"
            },
            {
                "id": "Prietenie și susținere emoțională",
                "text": "Prietenie și susținere emoțională"
            },
            {
                "id": "O conexiune fără presiune",
                "text": "O conexiune fără presiune"
            },
            {
                "id": "Aventura",
                "text": "Aventura"
            },
            {
                "id": "Încă nu stiu",
                "text": "Încă nu stiu"
            }
        ],
        },
        {
          id: 'varsta-eu',
          text: 'Ce vârstă ai?',
          type: 'select',
          openAnswerInfo: {
            text: 'Scrie',
          },
          options: [],
        },
        {
          id: 'varsta-partener',
          text: 'În ce interval de vârstă îți dorești un partener?',
          type: 'select',
          options: [
            {
                "id": "18-25 ani",
                "text": "18-25 ani"
            },
            {
                "id": "26-35 ani",
                "text": "26-35 ani"
            },
            {
                "id": "36-45 ani",
                "text": "36-45 ani"
            },
            {
                "id": "46+ ani",
                "text": "46+ ani"
            },
            {
                "id": "55+ ani",
                "text": "55+ ani"
            },
            {
                "id": "65+ ani",
                "text": "65+ ani"
            }
        ],
        },
        {
          id: 'importanta-relatie',
          text: 'Ce este important pentru tine într-o relație? Ordonează după importanță.',
          type: 'order',
          options: [
            {
                "id": "<strong>Comunicare și sinceritate</strong>: „Este esențial să putem vorbi deschis și sincer.”",
                "text": "<strong>Comunicare și sinceritate</strong>: „Este esențial să putem vorbi deschis și sincer.”"
            },
            {
                "id": "<strong>Respect și încredere</strong>: „Respectul și încrederea sunt fundamentale.”",
                "text": "<strong>Respect și încredere</strong>: „Respectul și încrederea sunt fundamentale.”"
            },
            {
                "id": "<strong>Sprijin emoțional</strong>: „Vreau un partener care mă susține și mă înțelege.”",
                "text": "<strong>Sprijin emoțional</strong>: „Vreau un partener care mă susține și mă înțelege.”"
            },
            {
                "id": "<strong>Compromisuri și echilibru</strong>: „Este important să facem compromisuri și să ne respectăm.”",
                "text": "<strong>Compromisuri și echilibru</strong>: „Este important să facem compromisuri și să ne respectăm.”"
            },
            {
                "id": "<strong>Afecțiune și timp împreună</strong>: „Gesturile mici de afecțiune și timpul petrecut împreună sunt esențiale.”",
                "text": "<strong>Afecțiune și timp împreună</strong>: „Gesturile mici de afecțiune și timpul petrecut împreună sunt esențiale.”"
            }
        ],
        },
      ],
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class DbService {
  // TODO: actually implement this
  user$ = new BehaviorSubject(user1);

  questionnaires$ = new BehaviorSubject([
    'Persoane cu afecțiuni medicale',
    'Persoane văduve/divorțate/cu copii/singure',
    'Persoane celebre/influenceri',
  ]);
  compatibilities$ = new BehaviorSubject([
    'Gigi Becali',
    'Florin Citu',
    'Ana Blandiana',
  ]);

  constructor() {}
}
