import { Request, Response } from 'express';
import Artikal from '../models/artikal';
import Prodavnica from '../models/prodavnica';
import Korisnik from '../models/korisnik';

export class ArtikalController {
 dodajArtikal = async (req: Request, res: Response) => {
  try {
    const { tip, kategorija, velicina, boja, cena, email, opis } = req.body;

    const imageFiles = (req.files as Express.Multer.File[]) || [];

    const prodavnica = await Prodavnica.findOne({ email }).exec();
    if (!prodavnica) {
      return res.status(404).json({ message: 'Prodavnica nije pronađena.' });
    }

    const slikePaths = imageFiles.map((file) => file.path);

    const noviArtikal = new Artikal({
      tip,
      kategorija,
      velicina,
      boja,
      cena,
      opis,
      slike: slikePaths,          // ⬅ sve slike od tog artikla
      prodavnica: prodavnica._id
    });

    const savedArtikal = await noviArtikal.save();

    await Prodavnica.findByIdAndUpdate(
      prodavnica._id,
      { $push: { artikli: savedArtikal._id } },
      { new: true }
    );

    res.status(201).json({ message: 'Artikal uspešno dodat.', artikal: savedArtikal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri dodavanju artikla.' });
  }
};


   getArtikliByStore = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const prodavnica = await Prodavnica.findOne({ email }).populate('artikli');
      if (!prodavnica) {
        return res.status(404).json({ message: 'Prodavnica nije pronađena.' });
      }
      res.json({ artikli: prodavnica.artikli });
    } catch (error) {
      res.status(500).json({ message: 'Greška pri dohvatanju artikala.', error });
    }
  }

  // Update a specific article
   updateArtikal = async (req: Request, res: Response) =>{
    try {
      const { id } = req.params;
      const updatedArtikal = await Artikal.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedArtikal);
    } catch (error) {
      res.status(500).json({ message: 'Greška pri ažuriranju artikla.', error });
    }
  }

  getArtikliByCategory = async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      console.log(category);
      const artikli = await Artikal.find({ kategorija: category });
      res.json({ artikli });
    } catch (error) {
      res.status(500).json({ message: 'Greška pri dohvatanju artikala.', error });
    }
  };

  getArtikalById = async (req: Request, res: Response) => {
    try {
      const artikalId = req.params.id;
      const artikal = await Artikal.findById(artikalId).exec();

      if (!artikal) {
        return res.status(404).json({ message: 'Artikal nije pronađen.' });
      }

      res.status(200).json(artikal);
    } catch (error) {
      console.error('Greška pri dohvatanju artikla:', error);
      res.status(500).json({ message: 'Greška pri dohvatanju artikla.' });
    }
  };

  getArtikalWithProdavnica = async (req: Request, res: Response) => {
    try {
      const artikalId = req.params.id;
      
      // Pronađi artikal zajedno s podacima o prodavnici
      const artikal = await Artikal.findById(artikalId).populate('prodavnica');
      
      if (!artikal) {
        return res.status(404).json({ message: 'Artikal nije pronađen.' });
      }
  
      // Pronađi ostale artikle iz iste prodavnice
      const relatedArtikli = await Artikal.find({ prodavnica: artikal.prodavnica._id, _id: { $ne: artikalId } });
  
      // Vrati artikal, prodavnicu i povezane artikle
      res.json({ artikal, prodavnica: artikal.prodavnica, relatedArtikli });
    } catch (error) {
      res.status(500).json({ message: 'Greška pri dohvatanju artikla s podacima o prodavnici.', error });
    }
  };

  // U ProdavnicaController ili sličnom
  getNoviArtikliZaKorisnika = async (req: Request, res: Response) => {
    try {
      const korisnikId = req.body.korisnikId; // Pretpostavljamo da šaljete korisnik ID u telu zahteva

      // Pronađite omiljene prodavnice korisnika
      const korisnik = await Korisnik.findById(korisnikId).populate('omiljeneProdavnice');
      if (!korisnik) {
        return res.status(404).json({ message: 'Korisnik nije pronađen.' });
      }

      // Pronađite nove artikle iz omiljenih prodavnica
      const noviArtikli = await Artikal.find({
        prodavnica: { $in: korisnik.omiljeneProdavnice.map(prodavnica => prodavnica._id) },
        // Prikazujte nove artikle dodane u poslednja 24h
        datumDodavanja: { $gte: new Date(Date.now() - 100 * 60 * 60 * 1000) }
      }).populate('prodavnica');
      res.json({ noviArtikli });
      console.log(noviArtikli);
    } catch (error) {
      console.error('Greška pri dohvatanju novih artikala:', error);
      res.status(500).json({ message: 'Greška pri dohvatanju novih artikala.', error });

    }
  }

  

  
}
