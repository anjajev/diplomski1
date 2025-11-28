import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  kupac: Schema.Types.ObjectId;
  prodavnica: Schema.Types.ObjectId;
  ocena: number;
  komentar: string;
  datumRecenzije: Date;
  narudzbinaId: string;
}

const ReviewSchema = new mongoose.Schema({
  kupac: { type: Schema.Types.ObjectId, ref: 'Korisnik', required: true },
  prodavnica: { type: Schema.Types.ObjectId, ref: 'Prodavnica', required: true },
  ocena: { type: Number, required: true, min: 1, max: 5 },
  komentar: { type: String },
  datumRecenzije: { type: Date, default: Date.now },
  narudzbinaId: { type: String }
});

const Review = mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
