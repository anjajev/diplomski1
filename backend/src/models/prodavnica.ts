import mongoose from 'mongoose';


export interface IProdavnica extends Document {
  [x: string]: any;
  ime: string;
  adresa: string;
  opis: string;
  radnoVreme: string;
  kontaktInfo: string;
  lozinka: string;
  email: string;
  tip: string;
  artikli: mongoose.Types.ObjectId;
  slika: string;
}


const ProdavnicaSchema = new mongoose.Schema({
  ime: { type: String, required: true },
  adresa: { type: String, required: true },
  opis: { type: String },
  radnoVreme: { type: String },
  kontaktInfo: { type: String, required: true },
  lozinka: { type: String, required: true },
  email: { type: String, required: true },
  tip: { type: String, required: true },
  artikli: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artikal' }],  
  slika: { type: String }

});

const Prodavnica = mongoose.model('Prodavnica', ProdavnicaSchema);
export default Prodavnica;
