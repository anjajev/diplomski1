import mongoose, { Schema, Document } from 'mongoose';
import { IArtikal } from './artikal';  // Sada možete uvesti interfejs
import { IProdavnica } from './prodavnica';

export interface IKorisnik extends Document {
  username: string;
  password: string;
  ime: string;
  prezime: string;
  email: string;
  tipProfila: string;
  favourites: IArtikal[];  // Polje za omiljene artikle
  cart: IArtikal[];
  omiljeneProdavnice: IProdavnica[];
  prethodneKupovine: IArtikal[];

}

const KorisnikSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  email: { type: String, required: true },
  tipProfila: { type: String, required: true },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artikal', required: false }],  
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artikal', required: false }],  
  omiljeneProdavnice: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prodavnica' }],
  prethodneKupovine:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artikal', required: false }]

});

const Korisnik = mongoose.model<IKorisnik>('Korisnik', KorisnikSchema);
export default Korisnik;
