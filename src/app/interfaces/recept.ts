export class Recept {
  UID: string;
  naam: string;
  aantalPersonen: number;
  benodigdeTijd: number;
  beschrijving: string;
  bereiding: string;
  isPubliek: boolean;
  ingredienten: Array<any>;
  thumbnail: string;
  userUID: string;
}
