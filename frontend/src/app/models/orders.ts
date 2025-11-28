import { Artikal } from "./artikal";
import { Prodavnica } from "./prodavnica";
import { Review } from "./review";

export interface Order {
    _id: string;
    kupac: string; // ID korisnika (kupca)
    prodavnica: string; // ID prodavnice
    artikli: Artikal[]; // Lista ID-eva artikala
    ukupnaCena: number;
    datumNarudzbine: Date;
    status: 'U obradi' | 'Poslato' | 'Potvrdjeno';
    obavestenjeZaProdavnicu: boolean;
    imeKupca: string;       // Ime kupca
     prezimeKupca: string;   // Prezime kupca
    adresaDostave: string;    // Adresa za dostavu
    kontaktTelefon: string; // Kontakt telefon kupca
    recenzije: Review;
  }
  