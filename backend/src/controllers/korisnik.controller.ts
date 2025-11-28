import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt'; // Importuj bcrypt za heširanje
import Korisnik from '../models/korisnik'; // Tvoj model korisnika
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


const saltRounds = 10; // Definišeš broj rundi za bcrypt
const secretKey = 'e0a48c02b598e0f1f39b5d3fac44338abfbe6a102eee891852727490841a2f76551f19b38d7ace6cd9e414ae5d42d4d6f2d65ae12522080e29153c35cbffa243';
export class KorisnikController {

  // Metoda za registraciju
  register = async (req: Request, res: Response) => {
    try {
        const { username, password, ime, prezime, email, tipProfila } = req.body;

        // Heširaj lozinku pre nego što je sačuvaš u bazi
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Kreiraj novog korisnika sa heširanom lozinkom
        const noviKorisnik = new Korisnik({
            username,
            password: hashedPassword, // Sada čuvaš heširanu lozinku
            ime,
            prezime,
            email,
            tipProfila
        });

        // Sačuvaj korisnika u bazu
        const korisnik = await noviKorisnik.save();

        // Vrati odgovor sa statusom 201 (kreirano)
        res.status(201).json({ message: 'Korisnik uspešno registrovan.', korisnik });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri registraciji korisnika.' });
    }
  }


  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const korisnik = await Korisnik.findOne({ email }).exec();
      if (!korisnik) {
        return res.status(401).json({ message: 'Neispravni email ili lozinka.' });
      }

      //proveravam da li je lozinka ispravna
      const provera = await bcrypt.compare(password, korisnik.password);
      if (!provera) {
        return res.status(401).json({ message: 'Neispravni email ili lozinka.' });
      }
      const token = jwt.sign(
        { id: korisnik._id, email: korisnik.email, tip: korisnik.tipProfila }, 
        secretKey,
        { expiresIn: '1h' } 
      );

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
        const user = await Korisnik.findOne({ email }).exec();
        res.json(user);
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

addToFavourites = async (req: Request, res: Response) => {
  try {
    
    const { userId, artikalId } = req.body;

    // Pronađi korisnika i dodaj artikal u omiljene ako već nije tu
    const korisnik = await Korisnik.findByIdAndUpdate(
      userId,
      { $addToSet: { favourites: artikalId } },  // Koristi $addToSet da se izbegnu duplikati
      { new: true }
    ).populate('favourites');

    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    res.json({ favourites: korisnik.favourites });
  } catch (error) {
    res.status(500).json({ message: 'Greška pri dodavanju u omiljene.', error });
  }
};

removeFromFavourites = async (req: Request, res: Response) => {
  try {
    const { userId, artikalId } = req.body;

    // Pronađi korisnika i ukloni artikal iz omiljenih
    const korisnik = await Korisnik.findByIdAndUpdate(
      userId,
      { $pull: { favourites: artikalId } },  // Uklanja artikal iz omiljenih
      { new: true }
    ).populate('favourites');

    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    res.json({ favourites: korisnik.favourites });
  } catch (error) {
    res.status(500).json({ message: 'Greška pri uklanjanju iz omiljenih.', error });
  }

  
};


getFavourites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Pronađi korisnika i dohvati omiljene artikle
    const korisnik = await Korisnik.findById(userId).populate('favourites').exec();

    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }


    res.json({ favourites: korisnik.favourites });
  } catch (error) {
    console.error('Greška pri dohvatanju omiljenih artikala:', error);
    res.status(500).json({ message: 'Greška pri dohvatanju omiljenih artikala.' });
  }

};




addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, artikalId } = req.body;

    // Pronađi korisnika i dodaj artikal u omiljene ako već nije tu
    const korisnik = await Korisnik.findByIdAndUpdate(
      userId,
      { $addToSet: { cart: artikalId } },  // Koristi $addToSet da se izbegnu duplikati
      { new: true }
    ).populate('cart');

    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    res.json({ favourites: korisnik.favourites });
  } catch (error) {
    res.status(500).json({ message: 'Greška pri dodavanju u omiljene.', error });
  }
};

// Ukloni artikal iz korpe
removeFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, artikalId } = req.body;

    // Pronađi korisnika i ukloni artikal iz omiljenih
    const korisnik = await Korisnik.findByIdAndUpdate(
      userId,
      { $pull: { cart: artikalId } },  // Uklanja artikal iz omiljenih
      { new: true }
    ).populate('cart');

    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    res.json({ favourites: korisnik.favourites });
  } catch (error) {
    res.status(500).json({ message: 'Greška pri uklanjanju iz omiljenih.', error });
  }

};

// Prikaži sadržaj korpe
getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Pronađi korisnika i dohvati omiljene artikle
    const korisnik = await Korisnik.findById(userId).populate('cart').exec();

    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }


    res.json({ cart: korisnik.cart });
  } catch (error) {
    console.error('Greška pri dohvatanju omiljenih artikala:', error);
    res.status(500).json({ message: 'Greška pri dohvatanju omiljenih artikala.' });
  }

}

  getCartCount = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // Pronađi korisnika na osnovu ID-a i prebroj artikle u korpi
      const korisnik = await Korisnik.findById(userId).populate('cart').exec();
      if (!korisnik) {
        return res.status(404).json({ message: 'Korisnik nije pronađen.' });
      }

      // Vraćamo broj artikala u korpi
      const cartCount = korisnik.cart.length;
      console.log(cartCount);
      return res.status(200).json({ count: cartCount });
    } catch (error) {
      console.error('Greška pri dohvatanju broja artikala u korpi:', error);
      return res.status(500).json({ message: 'Greška na serveru.' });
    }
  };


  getFavoriteCount = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // Pronađi korisnika na osnovu ID-a i prebroj artikle u korpi
      const korisnik = await Korisnik.findById(userId).populate('favourites').exec();
      if (!korisnik) {
        return res.status(404).json({ message: 'Korisnik nije pronađen.' });
      }

      // Vraćamo broj artikala u korpi
      const favouriteCount = korisnik.favourites.length;
      console.log(favouriteCount);
      return res.status(200).json({ count: favouriteCount });
    } catch (error) {
      console.error('Greška pri dohvatanju broja artikala u korpi:', error);
      return res.status(500).json({ message: 'Greška na serveru.' });
    }
  };


   addToFavorites = async (req: Request, res: Response) => {
    const { userId, storeId } = req.body;

    try {
      const user = await Korisnik.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Korisnik nije pronađen' });
      }

      if (!user.omiljeneProdavnice.includes(storeId)) {
        user.omiljeneProdavnice.push(storeId);
        await user.save();
      }

      return res.status(200).json({ message: 'Prodavnica dodata u omiljene' });
    } catch (error) {
      return res.status(500).json({ message: 'Greška pri dodavanju prodavnice u omiljene', error });
    }
  }

  // Funkcija za uklanjanje prodavnice iz omiljenih
   removeFromFavorites = async (req: Request, res: Response) => {
    const { userId, storeId } = req.body;

    try {
      const user = await Korisnik.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Korisnik nije pronađen' });
      }

      user.omiljeneProdavnice = user.omiljeneProdavnice.filter(id => id.toString() !== storeId);
      await user.save();

      return res.status(200).json({ message: 'Prodavnica uklonjena iz omiljenih' });
    } catch (error) {
      return res.status(500).json({ message: 'Greška pri uklanjanju prodavnice iz omiljenih', error });
    }
  }

   getFavoritesStores= async (req: Request, res: Response) =>{
    const { userId } = req.params;

    try {
      const user = await Korisnik.findById(userId).populate('omiljeneProdavnice');
      if (!user) {
        return res.status(404).json({ message: 'Korisnik nije pronađen' });
      }

      return res.status(200).json({ omiljeneProdavnice: user.omiljeneProdavnice });
    } catch (error) {
      return res.status(500).json({ message: 'Greška pri dohvatanju omiljenih prodavnica', error });
    }
  }

  // Kontroler za potvrdu kupovine
potvrdiKupovinu = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    // Pronađi korisnika
    const korisnik = await Korisnik.findById(userId).populate('cart').exec();
    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Prebaci artikle iz korpe u prethodne kupovine
    korisnik.prethodneKupovine.push(...korisnik.cart);

    // Očisti korpu
    korisnik.cart = [];

    // Sačuvaj izmene u bazi
    await korisnik.save();

    res.status(200).json({ message: 'Kupovina uspešno potvrđena.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri potvrdi kupovine.' });
  }
};


reset_password = async (req: express.Request, res: express.Response) => {
  try {
      const { email } = req.body; // Izvlačimo email iz tela zahteva
      const user = await Korisnik.findOne({ email }).exec(); // Pronalazimo korisnika po email-u

      if (!user) {
          return res.status(404).json({ message: 'Korisnik nije pronađen.' }); // Ako korisnik ne postoji
      }

      // Generiši novu lozinku
      const newPassword = this.generateRandomPassword(); // Pozivamo funkciju za generisanje lozinke

      // Ažuriraj lozinku u bazi podataka (hashiranje lozinke pre nego što je snimiš)
      user.password = await this.hashPassword(newPassword); // Pozivamo funkciju za hashiranje lozinke
      await user.save(); // Čuvamo korisnika sa novom lozinkom

      // Pošalji email korisniku sa novom lozinkom
      await this.sendResetPasswordEmail(user.email, newPassword); // Pozivamo funkciju za slanje email-a

      return res.status(200).json({ message: 'Nova lozinka je poslata na vaš email.' }); // Vraćamo uspešnu poruku
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Došlo je do greške pri resetovanju lozinke.' }); // Vraćamo grešku ako nešto pođe po zlu
  }
}

// Funkcija za generisanje nasumične lozinke
generateRandomPassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Funkcija za hashiranje lozinke
async hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10); // Koristimo bcrypt za generisanje soli
  return await bcrypt.hash(password, salt); // Hashiramo lozinku
}

// Funkcija za slanje email-a
async sendResetPasswordEmail(email: string, newPassword: string) {
  console.log("tu");
  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port:465,
      secure: true,
      auth: {
          user: 'jevtovic014@gmail.com',
          pass: 'qxxo bhhv rzdp rdhs',
      },
  });

  const mailOptions = {
      from: 'jevtovic014@gmail.com',
      to: email,
      subject: 'Nova lozinka',
      text: `Vaša nova lozinka je: ${newPassword}`,
  };

  await transporter.sendMail(mailOptions); // Šaljemo email
}



}