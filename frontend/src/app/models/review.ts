export interface Review {
    _id?: string; // Opcionalno polje za ID recenzije, jer će ga dobiti sa backend-a
    kupac: string; // ID kupca (korisnika koji je ostavio recenziju)
    prodavnica: string; // ID prodavnice kojoj je recenzija namenjena
    ocena: number; // Ocena recenzije (1-5)
    komentar?: string; // Opcionalni komentar recenzije
    datumRecenzije: Date; // Datum kada je recenzija ostavljena
  }
  