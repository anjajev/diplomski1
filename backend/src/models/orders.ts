import mongoose from "mongoose";
import { IKorisnik } from './korisnik';  // Sada možete uvesti interfejs


import { Document, Schema, model } from 'mongoose';
import { IProdavnica } from "./prodavnica";
import { IArtikal } from "./artikal";
import { IReview } from "./review";

// Definišemo interfejs koji opisuje model Orders
interface IOrders extends Document {
  kupac: string; // Referenca na korisnika
  prodavnica: string; // Referenca na prodavnicu
  artikli: IArtikal[]; // Lista referenci na artikle
  ukupnaCena: number; // Ukupna cena narudžbine
  imeKupca: string;
  prezimeKupca: string;
  adresaDostave: string;
  kontaktTelefon: string;
  datumNarudzbine: Date; // Datum kreiranja narudžbine
  status: 'U obradi' | 'Poslato' | 'Potvrdjeno'; // Status narudžbine
  obavestenjeZaProdavnicu: boolean; // Indikator da li prodavnica treba da vidi obaveštenje
  recenzije?: IReview; // Referenca na recenzije

}


const OrderSchema = new mongoose.Schema({
  kupac: { type: String, required: true }, 
  prodavnica: { type: String, required: true  }, 
  artikli: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artikal', required: true }], 
  ukupnaCena: { type: Number, required: true }, 
  imeKupca: { type: String, required: true }, 
  prezimeKupca: { type: String, required: true }, 
  adresaDostave: { type: String, required: true }, 
  kontaktTelefon: { type: String, required: true }, 
  datumNarudzbine: { type: Date, default: Date.now }, 
  status: { type: String, enum: ['U obradi', 'Poslato', 'Potvrđeno'], default: 'U obradi' }, 
  obavestenjeZaProdavnicu: { type: Boolean, default: true }, 
  recenzije: { type: Schema.Types.ObjectId, ref: 'Review' } 

});

  
const Orders = mongoose.model<IOrders>('Orders', OrderSchema);
export default Orders;
