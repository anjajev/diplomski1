import express from 'express'
import { KorisnikController } from '../controllers/korisnik.controller'
import { authMiddleware } from '../authMiddleware'


const korisnikRouter = express.Router()

korisnikRouter.route('/login').post(
    (req,res)=>new KorisnikController().login(req, res)
)

korisnikRouter.route('/register').post(
    (req,res)=>new KorisnikController().register(req, res)
)
korisnikRouter.route('/checkusername').post(
    (req,res)=>new KorisnikController().check_username(req, res)
)

korisnikRouter.route('/checkemail').post(
    (req,res)=>new KorisnikController().check_email(req, res)
)

korisnikRouter.post('/promeniLozinku', authMiddleware, (req, res) => new KorisnikController().promeniLozinku(req, res));

korisnikRouter.route('/addFavourite').post(
  authMiddleware, (req, res) => new KorisnikController().addToFavourites(req, res)
);

korisnikRouter.route('/reset-password').post(
  (req, res) => new KorisnikController().reset_password(req, res)
);

korisnikRouter.route('/removeFavourite').post(
    authMiddleware, (req, res) => new KorisnikController().removeFromFavourites(req, res)
);

korisnikRouter.get('/favourites/:userId', (req, res) => new KorisnikController().getFavourites(req, res));

korisnikRouter.post('/add-to-cart', (req, res) => new KorisnikController().addToCart(req, res));

korisnikRouter.post('/remove-from-cart', (req, res) => new KorisnikController().removeFromCart(req, res));

korisnikRouter.get('/:userId/cart', (req, res) => new KorisnikController().getCart(req, res));

korisnikRouter.get('/:userId/cart-count', (req, res) => new KorisnikController().getCartCount(req, res));

korisnikRouter.get('/:userId/favorite-count', (req, res) => new KorisnikController().getFavoriteCount(req, res));


korisnikRouter.route('/add-favorite').post(
    (req, res) => new KorisnikController().addToFavorites(req, res)
  );
  
  korisnikRouter.route('/remove-favorite').post(
    (req, res) => new KorisnikController().removeFromFavorites(req, res)
  );

  korisnikRouter.route('/:userId/favorites').get(
    (req, res) => new KorisnikController().getFavoritesStores(req, res)
  );
  
  // Ruta za potvrdu kupovine
korisnikRouter.route('/potvrdi-kupovinu').post(
    (req, res) => new KorisnikController().potvrdiKupovinu(req, res)
  );
  

export default korisnikRouter