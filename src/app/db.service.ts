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
  preferDropdown?: true; // if no open answer and no multiple choice, render as dropdown
}
export interface OrderQuestion {
  type: 'order';
}

export type Question = {
  id: string;
  text: string;
  options: Option[];
} & (SelectQuestion | OrderQuestion);

export interface Option {
  id: string;
  text: string;
}

export const OTHER_OPTION_ID = '@other';

// only works for SelectQuestion for now
export type Answer = {
  uId: string; // user id (phone)
  qId: string; // question id
  oId: '@other' | string; // option id
  value: true | string; // string for @other
};

export const user1: User = {
  phone: '0123456789',
  name: 'Ana-Maria',
  sub: 'admin',
};

export const questionnaire1: Questionnaire = {
  id: 'chestionar-1',
  title: 'Formularul meu',
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
          multipleChoiceInfo: {
            multipleChoicePermissionsRequired: ['multiple-categories'],
          },
        },
        {
          id: 'categorie-partener',
          text: 'Din ce categorie preferi să fie partenerul/partenera?',
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
              id: 'Persoane 55 ani +',
              text: 'Persoane 55 ani +',
            },
            {
              id: 'Persoane celebre',
              text: 'Persoane celebre',
            },
          ],
          multipleChoiceInfo: {
            multipleChoicePermissionsRequired: ['multiple-categories'],
          },
        },
      ],
    },
    {
      name: 'Aspecte generale',
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
            },
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
              id: 'O relație serioasă',
              text: 'O relație serioasă',
            },
            {
              id: 'Prietenie și susținere emoțională',
              text: 'Prietenie și susținere emoțională',
            },
            {
              id: 'O conexiune fără presiune',
              text: 'O conexiune fără presiune',
            },
            {
              id: 'Aventura',
              text: 'Aventura',
            },
            {
              id: 'Încă nu stiu',
              text: 'Încă nu stiu',
            },
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
              id: '18-25 ani',
              text: '18-25 ani',
            },
            {
              id: '26-35 ani',
              text: '26-35 ani',
            },
            {
              id: '36-45 ani',
              text: '36-45 ani',
            },
            {
              id: '46+ ani',
              text: '46+ ani',
            },
            {
              id: '55+ ani',
              text: '55+ ani',
            },
            {
              id: '65+ ani',
              text: '65+ ani',
            },
          ],
        },
        {
          id: 'importanta-relatie',
          text: 'Ce este important pentru tine într-o relație? Ordonează după importanță.',
          type: 'order',
          options: [
            {
              id: '<strong>Comunicare și sinceritate</strong>: „Este esențial să putem vorbi deschis și sincer.”',
              text: '<strong>Comunicare și sinceritate</strong>: „Este esențial să putem vorbi deschis și sincer.”',
            },
            {
              id: '<strong>Respect și încredere</strong>: „Respectul și încrederea sunt fundamentale.”',
              text: '<strong>Respect și încredere</strong>: „Respectul și încrederea sunt fundamentale.”',
            },
            {
              id: '<strong>Sprijin emoțional</strong>: „Vreau un partener care mă susține și mă înțelege.”',
              text: '<strong>Sprijin emoțional</strong>: „Vreau un partener care mă susține și mă înțelege.”',
            },
            {
              id: '<strong>Compromisuri și echilibru</strong>: „Este important să facem compromisuri și să ne respectăm.”',
              text: '<strong>Compromisuri și echilibru</strong>: „Este important să facem compromisuri și să ne respectăm.”',
            },
            {
              id: '<strong>Afecțiune și timp împreună</strong>: „Gesturile mici de afecțiune și timpul petrecut împreună sunt esențiale.”',
              text: '<strong>Afecțiune și timp împreună</strong>: „Gesturile mici de afecțiune și timpul petrecut împreună sunt esențiale.”',
            },
          ],
        },
        {
          id: 'ești deschis la o relație la distanță',
          text: 'Ești deschis(ă) la o relație la distanță?',
          type: 'select',
          options: [
            {
              id: 'da',
              text: 'Da',
            },
            {
              id: 'nu',
              text: 'Nu',
            },
          ],
        },
        {
          id: 'Ești dispus să te muți la partener/(ă) pentru relație serioasă?',
          text: 'Ești dispus să te muți la partener/(ă) pentru relație serioasă?',
          type: 'select',
          options: [
            {
              id: 'da',
              text: 'Da',
            },
            {
              id: 'nu',
              text: 'Nu',
            },
          ],
        },
        {
          id: 'În ce județ locuiești?',
          text: 'În ce județ locuiești?',
          type: 'select',
          preferDropdown: true,
          options: [
            { id: 'B', text: 'București' },
            { id: 'AB', text: 'Alba' },
            { id: 'AR', text: 'Arad' },
            { id: 'AG', text: 'Arges' },
            { id: 'BC', text: 'Bacău' },
            { id: 'BH', text: 'Bihor' },
            { id: 'BN', text: 'Bistrița' },
            { id: 'BT', text: 'Botoșani' },
            { id: 'BV', text: 'Brașov' },
            { id: 'BR', text: 'Brăila' },
            { id: 'BZ', text: 'Buzău' },
            { id: 'CS', text: 'Caraș' },
            { id: 'CL', text: 'Călărași' },
            { id: 'CJ', text: 'Cluj' },
            { id: 'CT', text: 'Constanța' },
            { id: 'CV', text: 'Covasna' },
            { id: 'DB', text: 'Dâmbovița' },
            { id: 'DJ', text: 'Dolj' },
            { id: 'GL', text: 'Galați' },
            { id: 'GR', text: 'Giurgiu' },
            { id: 'GJ', text: 'Gorj' },
            { id: 'HR', text: 'Harghita' },
            { id: 'HD', text: 'Hunedoara' },
            { id: 'IL', text: 'Ialomița' },
            { id: 'IS', text: 'Iași' },
            { id: 'IF', text: 'Ilfov' },
            { id: 'MM', text: 'Maramureș' },
            { id: 'MH', text: 'Mehedinți' },
            { id: 'MS', text: 'Mureș' },
            { id: 'NT', text: 'Neamț' },
            { id: 'OT', text: 'Olt	Slatina' },
            { id: 'PH', text: 'Prahova' },
            { id: 'SM', text: 'Satu' },
            { id: 'SJ', text: 'Sălaj' },
            { id: 'SB', text: 'Sibiu' },
            { id: 'SV', text: 'Suceava' },
            { id: 'TR', text: 'Teleorman' },
            { id: 'TM', text: 'Timiș' },
            { id: 'TL', text: 'Tulcea' },
            { id: 'VL', text: 'Vâlcea' },
            { id: 'VS', text: 'Vaslui' },
            { id: 'VN', text: 'Vrancea' },
          ],
        },
        {
          id: 'timp',
          text: 'Ce timp îți ia pentru a decide dacă te potrivești sau nu cu partenerul/partenera?',
          type: 'select',
          openAnswerInfo: {
            text: 'Scrie',
          },
          options: [],
        },
      ],
    },
    {
      name: 'Experiența ta medicală',
      questions: [
        {
          id: 'tip afectiune medicala',
          text: 'Ce tip de afecțiune medicală ai/ai avut? (Alege una sau mai multe – răspuns anonim, nu va fi vizibil altor utilizatori și îl vei comunica personal dacă dorești, în cazul în care se crează compatibilitate)',
          type: 'select',
          options: [
            {
              id: 'a) Afecțiuni neurologice (ex. epilepsie, AVC etc.)',
              text: 'a) Afecțiuni neurologice (ex. epilepsie, AVC etc.)',
            },
            {
              id: 'b) Afecțiuni cardiace',
              text: 'b) Afecțiuni cardiace',
            },
            {
              id: 'c) Afecțiuni oncologice',
              text: 'c) Afecțiuni oncologice',
            },
            {
              id: 'd) Obezitate',
              text: 'd) Obezitate',
            },
            {
              id: 'e) Probleme musculo-scheletale sau autoimune (ex. artrită, lupus, diabet etc.)',
              text: 'e) Probleme musculo-scheletale sau autoimune (ex. artrită, lupus, diabet etc.)',
            },
            {
              id: 'f) Recuperare post-accident sau post-chirurgicală',
              text: 'f) Recuperare post-accident sau post-chirurgicală',
            },
            {
              id: 'g) Probleme legate de mobilitate (ex. dizabilitate fizică)',
              text: 'g) Probleme legate de mobilitate (ex. dizabilitate fizică)',
            },
            {
              id: 'h) Afecțiuni rare sau cronice',
              text: 'h) Afecțiuni rare sau cronice',
            },
            {
              id: 'i) Afecțiuni cu transmitere sexuală (ex: hiv, sida etc)',
              text: 'i) Afecțiuni cu transmitere sexuală (ex: hiv, sida etc)',
            },
            {
              id: 'j) Prefer să nu răspund',
              text: 'j) Prefer să nu răspund',
            },
          ],
          openAnswerInfo: {
            text: 'Altă afecțiune ',
          },
        },
        {
          id: 'Îți dorești ca partenerul tău să fi trecut printr-o experiență medicală similară? (Alege una)',
          text: 'Îți dorești ca partenerul tău să fi trecut printr-o experiență medicală similară? (Alege una)',
          type: 'select',
          options: [
            {
              id: 'a) Da, cred că ar înțelege mai bine prin ce am trecut',
              text: 'a) Da, cred că ar înțelege mai bine prin ce am trecut',
            },
            {
              id: 'b) Nu neapărat, dar trebuie să fie empatic',
              text: 'b) Nu neapărat, dar trebuie să fie empatic',
            },
            {
              id: 'c) Nu contează, atâta timp cât avem o conexiune bună',
              text: 'c) Nu contează, atâta timp cât avem o conexiune bună',
            },
          ],
        },
        {
          id: 'Cum a influențat experiența medicală viziunea ta asupra relațiilor? ',
          text: 'Cum a influențat experiența medicală viziunea ta asupra relațiilor? (Alege un răspuns)',
          type: 'select',
          options: [
            {
              id: 'a) M-a făcut să înțeleg ce este cu adevărat important într-o relație',
              text: 'a) M-a făcut să înțeleg ce este cu adevărat important într-o relație',
            },
            {
              id: 'b) Am devenit mai atent(ă) la felul în care oamenii mă tratează',
              text: 'b) Am devenit mai atent(ă) la felul în care oamenii mă tratează',
            },
            {
              id: 'c) Apreciez mai mult conexiunile autentice și sprijinul reciproc',
              text: 'c) Apreciez mai mult conexiunile autentice și sprijinul reciproc',
            },
            {
              id: 'd) Sunt mai selectiv(ă) și caut pe cineva care să mă înțeleagă',
              text: 'd) Sunt mai selectiv(ă) și caut pe cineva care să mă înțeleagă',
            },
          ],
        },
        {
          id: 'Care este cel mai mare obstacol de depășit pe care îl întâmpinați?',
          text: 'Care este cel mai mare obstacol de depășit pe care îl întâmpinați?',
          type: 'select',
          options: [],
          openAnswerInfo: {
            text: 'Scrie',
          },
        },
        {
          id: 'Cum îți petreci de obicei timpul liber? (Alege până la 3)',
          text: 'Cum îți petreci de obicei timpul liber? (Alege până la 3)',
          type: 'select',
          options: [
            {
              id: 'a) Citind sau învățând lucruri no',
              text: 'a) Citind sau învățând lucruri no',
            },
            {
              id: 'b) Creând (desen, scris, muzică)',
              text: 'b) Creând (desen, scris, muzică)',
            },
            {
              id: 'c) Jocuri video sau seriale/filme',
              text: 'c) Jocuri video sau seriale/filme',
            },
            {
              id: 'd) Activități ușoare în aer liber (plimbări, grădinărit)',
              text: 'd) Activități ușoare în aer liber (plimbări, grădinărit)',
            },
            {
              id: 'e) Relaxare și mindfulness',
              text: 'e) Relaxare și mindfulness',
            },
            {
              id: 'f) Gătind sau experimentând rețete noi',
              text: 'f) Gătind sau experimentând rețete noi',
            },
            {
              id: 'g) Stau acasă',
              text: 'g) Stau acasă',
            },
          ],
          openAnswerInfo: {
            text: 'h) Alt răspuns',
          },
          multipleChoiceInfo: {
            multipleChoicePermissionsRequired: [],
          },
        },
        {
          id: 'Când vine vorba de sănătatea ta, ce ți-ai dori să înțeleagă partenerul tău? ',
          text: 'Când vine vorba de sănătatea ta, ce ți-ai dori să înțeleagă partenerul tău? ',
          type: 'select',
          options: [
            {
              id: 'a) Că am zile bune și zile mai dificile și asta e normal',
              text: 'a) Că am zile bune și zile mai dificile și asta e normal',
            },
            {
              id: 'b) Că uneori am nevoie de mai mult timp pentru mine',
              text: 'b) Că uneori am nevoie de mai mult timp pentru mine',
            },
            {
              id: 'c) Că am trecut printr-un proces de vindecare și încă învăț să mă adaptez',
              text: 'c) Că am trecut printr-un proces de vindecare și încă învăț să mă adaptez',
            },
            {
              id: 'd) Că nu vreau ca sănătatea mea să fie singurul lucru care mă definește',
              text: 'd) Că nu vreau ca sănătatea mea să fie singurul lucru care mă definește)',
            },
          ],
        },
        {
          id: 'Cum îți exprimi sau simți să-ți exprimi afecțiunea într-o relație? ',
          text: 'Cum îți exprimi sau simți să-ți exprimi afecțiunea într-o relație? (Alege mai multe variante)',
          type: 'select',
          options: [
            {
              id: 'a) Prin comunicare deschisă și sinceritate',
              text: 'a) Prin comunicare deschisă și sinceritate',
            },
            {
              id: 'b) Prin atingeri și gesturi de afecțiune',
              text: 'b) Prin atingeri și gesturi de afecțiune',
            },
            {
              id: 'c) Prin mici surprize și gesturi de apreciere',
              text: 'c) Prin mici surprize și gesturi de apreciere',
            },
            {
              id: 'd) Prin timpul petrecut împreună',
              text: 'd) Prin timpul petrecut împreună',
            },
            {
              id: 'e) Prin sprijin și loialitate în momente grele',
              text: 'e) Prin sprijin și loialitate în momente grele',
            },
          ],
          multipleChoiceInfo: {
            multipleChoicePermissionsRequired: [],
          },
        },
        {
          id: 'Ce dificultăți întâmpinați în relațiile intime sau romantice din cauza afecțiunii?',
          text: 'Ce dificultăți întâmpinați în relațiile intime sau romantice din cauza afecțiunii? ',
          type: 'select',
          options: [
            {
              id: 'a) oboseală',
              text: 'a) oboseală',
            },
            {
              id: 'b) disconfort fizic',
              text: 'b) disconfort fizic',
            },
            {
              id: 'c) lipsa de încredere în sine',
              text: 'c) lipsa de încredere în sine',
            },
          ],
          openAnswerInfo: {
            text: 'Alt răspuns',
          },

          multipleChoiceInfo: {
            multipleChoicePermissionsRequired: [],
          },
        },
        {
          id: 'compromisuri',
          text: 'Ce compromisuri poți accepta și nu poți accepta pentru relație?',
          type: 'select',
          openAnswerInfo: {
            text: 'Scrie',
          },
          options: [],
        },
        {
          id: 'descriere partener',
          text: 'Dacă ai putea descrie partenera/partenerul potrivit(ă) în cuvinte, care ar fi acelea?  (Exemple: poți preciza aspecte fizice, morale, de personalitate, valori, interese comune, experiențe de viață)',
          type: 'select',
          openAnswerInfo: {
            text: 'Scrie',
          },
          options: [],
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
  answers$ = new BehaviorSubject<Answer[]>([]);

  questionnaires$ = new BehaviorSubject([questionnaire1]);

  constructor() {
    // TODO: this will surely break once the model changes
    if (localStorage.getItem('answers')) {
      this.answers$.next(JSON.parse(localStorage.getItem('answers')!));
    }
    this.answers$.subscribe((answers) => {
      localStorage.setItem('answers', JSON.stringify(answers));
    });
  }
}
