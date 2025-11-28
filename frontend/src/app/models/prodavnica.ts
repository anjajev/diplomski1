import { Artikal } from "./artikal";

export class Prodavnica{
    _id!: string;
    ime!: string;
    adresa!: string;
    opis!: string;
    radnoVreme!: string;
    kontaktInfo!: string;
    lozinka!: string;
    email!: string;
    tip!: string;
    artikli!: Artikal[];
    slika!: string;
    
}