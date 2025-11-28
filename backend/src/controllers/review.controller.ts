import { Request, Response } from 'express';
import Review from '../models/review';
import Orders from '../models/orders';

export class RecenzijaController {

 dodajRecenziju = async (req: Request, res: Response) => {
  const { kupacId, prodavnicaId, ocena, komentar, narudzbinaId } = req.body;

  console.log(req.body);
  try {
    const novaRecenzija = new Review({
      kupac: kupacId,
      prodavnica: prodavnicaId,
      ocena,
      komentar,
      narudzbinaId
    });

    const sacuvanaRecenzija = await novaRecenzija.save();

    await Orders.findByIdAndUpdate(
      narudzbinaId, // ID narudžbine
      { $push: { recenzije: sacuvanaRecenzija._id } }, // Dodaj recenziju u niz
      { new: true } // Vraća ažuriranu verziju dokumenta
    );
    return res.status(201).json({ message: 'Recenzija uspešno dodata.', recenzija: sacuvanaRecenzija });
  } catch (error) {
    return res.status(500).json({ message: 'Greška pri dodavanju recenzije.', error });
  }
};

dohvatiRecenzije = async (req: Request, res: Response) => {
  const { prodavnicaId } = req.params;

  try {
    const recenzije = await Review.find({ prodavnica: prodavnicaId }).populate('kupac', 'ime'); // Uključuje ime kupca
    return res.status(200).json(recenzije);
  } catch (error) {
    return res.status(500).json({ message: 'Greška pri dohvatanju recenzija.', error });
  }
};
}