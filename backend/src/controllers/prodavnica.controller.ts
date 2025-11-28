import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt'; // Importuj bcrypt za heširanje
import Korisnik from '../models/korisnik'; // Tvoj model korisnika
import jwt from 'jsonwebtoken';
import Prodavnica from '../models/prodavnica';
import Artikal from '../models/artikal';
import upload from '../config/multerConfig';


const saltRounds = 10; // Definišeš broj rundi za bcrypt
const secretKey = 'e0a48c02b598e0f1f39b5d3fac44338abfbe6a102eee891852727490841a2f76551f19b38d7ace6cd9e414ae5d42d4d6f2d65ae12522080e29153c35cbffa243';
export class ProdavnicaController {

  // Metoda za registraciju
  register = async (req: Request, res: Response) => {
    try {
        const { ime, email, adresa, radnovreme, kontakt, lozinka, tipProfila } = req.body;

        // Heširaj lozinku pre nego što je sačuvaš u bazi
        const hashedPassword = await bcrypt.hash(lozinka, saltRounds);
        // Kreiraj novog korisnika sa heširanom lozinkom
        const novaProdavnica = new Prodavnica({
            ime: ime,
            adresa: adresa,
            opis: '',
            radnoVreme: radnovreme,
            kontaktInfo: kontakt,
            lozinka: hashedPassword,
            email: email,
            tip: tipProfila
        });

        // Sačuvaj korisnika u bazu
        const prodavnica = await novaProdavnica.save();

        // Vrati odgovor sa statusom 201 (kreirano)
        res.status(201).json({ message: 'Prodavnica uspešno registrovan.', prodavnica });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri registraciji prodavnice.' });
    }
  }


  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Pronađi korisnika po email-u
      const prodavnica = await Prodavnica.findOne({ email }).exec();

      if (!prodavnica) {
        return res.status(401).json({ message: 'Neispravni email ili lozinka.' });
      }

      // Proveri da li je lozinka ispravna koristeći bcrypt
      const isMatch = await bcrypt.compare(password, prodavnica.lozinka);

      if (!isMatch) {
        return res.status(401).json({ message: 'Neispravni email ili lozinka.' });
      }

      // Ako su email i lozinka ispravni, generiši JWT token
      const token = jwt.sign(
        { id: prodavnica._id, email: prodavnica.email, ime: prodavnica.ime}, // Sadržaj tokena
        secretKey,
        { expiresIn: '1h' } // Token važi 1 sat
      );

      // Vrati token korisniku
      res.json({ token });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Greška pri prijavljivanju.' });
    }
  }


check_username = async (req: express.Request, res: express.Response) => {
    try {
        const { username } = req.body;
        const user = await Korisnik.findOne({ username }).exec();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Došlo je do greške pri proveri korisničkog imena.' });
    }
}

check_email = async (req: express.Request, res: express.Response) => {
    try {
        const { email } = req.body;
        console.log(email);
        const prodavnica = await Prodavnica.findOne({ email }).exec();
        res.json(prodavnica);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Došlo je do greške pri proveri email adrese.' });
    }
}

promeniLozinku = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password } = req.body;
        const user = await Korisnik.findOneAndUpdate(
            { username, password },
            { password }, // Ako želiš da ažuriraš lozinku, koristi objekat sa ažuriranim vrednostima
            { new: true } // Opcija da vrati ažuriran dokument
        ).exec();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Došlo je do greške pri promeni lozinke.' });
    }
}

getStore = async (req: express.Request, res: express.Response) => {
  try {
    const email = req.params.email;

    const prodavnica = await Prodavnica.findOne({ email })
      .populate('artikli')      // 👈 OVO JE KLJUČNO
      .exec();

    if (!prodavnica) {
      return res.status(404).json({ message: 'Prodavnica nije pronađena' });
    }

    res.json(prodavnica);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška prilikom dohvatanja prodavnice.' });
  }
};


 azurirajProdavnicu= async (req: express.Request, res: express.Response) => {
  const { email, ...updatedStoreData } = req.body; // Preuzmi email i ažurirane podatke iz zahteva
  console.log(email);
  console.log(updatedStoreData);
  try {
    const prodavnica = await Prodavnica.findOneAndUpdate(
      { email: email }, // Pronađi prodavnicu na osnovu email-a
      { $set: updatedStoreData }, // Ažuriraj sa novim podacima
      { new: true } // Vrati ažurirani dokument
    );

    if (!prodavnica) {
      return res.status(404).json({ message: 'Prodavnica nije pronađena' });
    }

    res.status(200).json(prodavnica); // Vrati ažuriranu prodavnicu
  } catch (error) {
    res.status(500).json({ message: 'Greška pri ažuriranju prodavnice', error });
  }
}
 getProdavnicaWithArtikli = async(req: express.Request, res: express.Response) =>  {
    try {
      const prodavnicaId = req.params.id;

      // Pronađi prodavnicu po ID-ju i popuni njeno polje "artikli"
      const prodavnica = await Prodavnica.findById(prodavnicaId).populate('artikli');
      if (!prodavnica) {
          return res.status(404).json({ error: 'Prodavnica nije pronađena' });
      }

      // Vrati prodavnicu i njene artikle
      res.json({
          prodavnica: prodavnica
      });
  } catch (error) {
      console.error('Greška pri dohvatanju prodavnice i artikala:', error);
      res.status(500).json({ error: 'Greška pri dohvatanju prodavnice i artikala' });
  }
}

uploadProfileImage = async (req: Request, res: Response) => {
  const imageFile = req.file;

  try {
    const { email } = req.body;
    const prodavnica = await Prodavnica.findOne({ email }).exec();
    if (!prodavnica) {
      return res.status(404).json({ message: 'Prodavnica nije pronađena.' });
    }

    // Ažuriraj putanju profilne slike
    prodavnica.slika = imageFile ? imageFile.path : '';
    await prodavnica.save();

    res.status(200).json({ message: 'Profilna slika uspešno dodata.', slika: prodavnica.slika });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri dodavanju profilne slike.' });
  }
}
   
}