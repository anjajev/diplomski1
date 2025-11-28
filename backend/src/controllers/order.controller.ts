import { Request, Response } from 'express';
import Orders from '../models/orders'; // Pretpostavljam da je putanja do modela Orders
import Korisnik from '../models/korisnik'; // Za rad sa korisnicima
import Prodavnica from '../models/prodavnica'; // Za rad sa prodavnicama

export class OrdersController {

  kreirajNarudzbinu = async (req: Request, res: Response) => {
    const { kupacId, prodavnicaId, artikli, ukupnaCena, imeKupca, prezimeKupca, adresaDostave, kontaktTelefon } = req.body;
  
    try {
      // Kreiraj novu narudžbinu sa primljenim podacima
      const novaNarudzbina = new Orders({
        kupac: kupacId,
        prodavnica: prodavnicaId,
        artikli,
        ukupnaCena,
        imeKupca,
        prezimeKupca,
        adresaDostave,
        kontaktTelefon,
        status: 'U obradi', // Inicijalni status narudžbine
        obavestenjeZaProdavnicu: true // Postavi na true kako bi prodavnica dobila obaveštenje
      });
  
      // Sačuvaj narudžbinu u bazi
      const sacuvanaNarudzbina = await novaNarudzbina.save();
  
      return res.status(201).json({ message: 'Narudžbina uspešno kreirana.', narudzbina: sacuvanaNarudzbina });
    } catch (error) {
      console.error('Greška pri kreiranju narudžbine:', error);
      return res.status(500).json({ message: 'Greška pri kreiranju narudžbine.', error });
    }
  }

  // Dohvati sve narudžbine za prodavnicu
  dohvatiNarudzbineZaProdavnicu = async (req: Request, res: Response) => {
    const { prodavnicaId } = req.params;
    const { status } = req.query; // Izvlačenje statusa iz query parametara
  
    try {
      let filter: { [key: string]: any } = { prodavnica: prodavnicaId };
  
      // Proveravamo status, ako nije "U obradi", dodajemo logiku da se izbegne taj status
      if (status && status !== 'U obradi') {
        filter['status'] = { $ne: 'U obradi' }; // Status koji nije "U obradi"
      } else if (status) {
        filter['status'] = status; // Ako je status "U obradi", pretražujemo samo po tom statusu
      }
  
      const narudzbine = await Orders.find(filter)
        .populate('kupac')
        .populate('artikli')
        .populate('recenzije'); // Dodaj populaciju za recenzije

        
      return res.status(200).json(narudzbine);
    } catch (error) {
      return res.status(500).json({ message: 'Greška pri dohvatanju narudžbina.', error });
    }
  }
  

  dohvatiNarudzbineZaKupca = async (req: Request, res: Response) => {
    const { kupacId } = req.params;

    try {
        // Prvo dohvati sve narudžbine za datog kupca
        const narudzbine = await Orders.find({ kupac: kupacId }).populate('kupac').populate('artikli');
        
        // Pronađi korisnika kako bi se ispraznila korpa
        const korisnik = await Korisnik.findById(kupacId).exec();
        if (!korisnik) {
            return res.status(404).json({ message: 'Korisnik nije pronađen' });
        }

        // Isprazni korisnikovu korpu
        korisnik.cart = [];

        // Sačuvaj ažuriranog korisnika nakon pražnjenja korpe
        await korisnik.save();

        // Vrati narudžbine nakon ažuriranja korpe
        return res.status(200).json(narudzbine);
    } catch (error) {
        return res.status(500).json({ message: 'Greška pri dohvatanju narudžbina.', error });
    }
};

  

  // Potvrdi narudžbinu
  potvrdiNarudzbinu = async (req: Request, res: Response) => {
    const { narudzbinaId } = req.params;

    try {
      const narudzbina = await Orders.findByIdAndUpdate(narudzbinaId, { status: 'Potvrđeno' }, { new: true });

      if (!narudzbina) {
        return res.status(404).json({ message: 'Narudžbina nije pronađena.' });
      }

      return res.status(200).json({ message: 'Narudžbina uspešno potvrđena.', narudzbina });
    } catch (error) {
      return res.status(500).json({ message: 'Greška pri potvrđivanju narudžbine.', error });
    }
  }

  // Postavi status narudžbine na "Poslato"
  postaviStatusNaPoslato = async (req: Request, res: Response) => {
    const { narudzbinaId } = req.params;

    try {
      const narudzbina = await Orders.findByIdAndUpdate(narudzbinaId, { status: 'Poslato' }, { new: true });
      if (!narudzbina) {
        return res.status(404).json({ message: 'Narudžbina nije pronađena.' });
      }

      return res.status(200).json({ message: 'Narudžbina uspešno poslata.', narudzbina });
    } catch (error) {
      return res.status(500).json({ message: 'Greška pri slanju narudžbine.', error });
    }
  }

  // Ažuriranje statusa narudžbine na "Potvrđeno"
  postaviStatusNaPotvrdjeno = async (req: Request, res: Response) => {
    const { narudzbinaId } = req.params;

    try {
      const narudzbina = await Orders.findByIdAndUpdate(narudzbinaId, { status: 'Potvrdjeno' }, { new: true });
      if (!narudzbina) {
        return res.status(404).json({ message: 'Narudžbina nije pronađena.' });
      }

      return res.status(200).json({ message: 'Narudžbina uspešno poslata.', narudzbina });
    } catch (error) {
      return res.status(500).json({ message: 'Greška pri slanju narudžbine.', error });
    }
};

// U OrdersController

dohvatiStatistikuNarudzbina = async (req: Request, res: Response) => {
  try {
      // Prikupi statistiku narudžbina koristeći MongoDB agregacije
      const statistics = await Orders.aggregate([
          {
              // Razvijanje niza 'artikli' u svakoj narudžbini
              $unwind: "$artikli"
          },
          {
              // Uključivanje detalja o artiklima koristeći 'lookup'
              $lookup: {
                  from: "artikals", // Ime kolekcije sa artiklima
                  localField: "artikli", // Polje iz narudžbine
                  foreignField: "_id", // Polje iz kolekcije 'artikals'
                  as: "artikalDetails" // Naziv novog polja za detalje artikala
              }
          },
          {
              // Razvijanje detalja artikala
              $unwind: "$artikalDetails"
          },
          {
              // Grupisanje rezultata po mesecu
              $group: {
                  _id: { $month: "$datumNarudzbine" }, // Grupisanje po mesecu
                  totalItems: { $sum: 1 }, // Ukupan broj artikala za mesec
                  totalPrice: { $sum: "$artikalDetails.cena" } // Ukupna cena artikala za mesec
              }
          },
          {
              // Sortiranje rezultata po mesecu
              $sort: { "_id": 1 }
          }
      ]);

      // Inicijalizovanje niza sa 12 meseci, svaki mesec ima početne vrednosti 0 za broj artikala i cenu
      const result = new Array(12).fill({ items: 0, price: 0 });

      // Popunjavanje rezultata na osnovu statistike
      statistics.forEach(stat => {
          const monthIndex = stat._id - 1; // Indeks meseca (0-11)

          // Ažuriranje vrednosti za odgovarajući mesec
          result[monthIndex] = {
              items: stat.totalItems, // Broj artikala za mesec
              price: stat.totalPrice // Ukupna cena artikala za mesec
          };
      });

      // Prikaz rezultata u konzoli radi debagovanja
      console.log(result);

      // Vraćanje rezultata kao JSON odgovor
      return res.status(200).json(result);
  } catch (error) {
      // U slučaju greške, prikazujemo grešku u konzoli i šaljemo odgovor klijentu
      console.error('Greška prilikom dohvatanja statistike:', error);
      return res.status(500).json({ message: 'Greška prilikom dohvatanja statistike.', error });
  }
}


}

