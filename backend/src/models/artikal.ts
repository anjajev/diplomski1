import mongoose, { Document, Schema } from 'mongoose';

export interface IArtikal extends Document {
  tip: string;
  cena: number;
  kategorija: string;
  velicina: string;
  boja: string;
  slike: string[];               // više slika
  prodavnica: mongoose.Types.ObjectId;
  datumDodavanja: Date;
  opis?: string;                 // ako želiš da čuvaš opis
}

const ArtikalSchema: Schema = new Schema({
  tip: { type: String, required: true },
  cena: { type: Number, required: true },
  kategorija: { type: String, required: true },
  velicina: { type: String, required: true },
  boja: { type: String, required: true },
  slike: [{ type: String }],     // niz stringova – putanje slika
  prodavnica: { type: mongoose.Schema.Types.ObjectId, ref: 'Prodavnica', required: true },
  datumDodavanja: { type: Date, default: Date.now },
  opis: { type: String }         // opciono
});


const Artikal = mongoose.model<IArtikal>('Artikal', ArtikalSchema);
export default Artikal;
