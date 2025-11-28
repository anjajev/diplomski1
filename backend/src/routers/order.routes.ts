import express from 'express';
import { OrdersController } from '../controllers/order.controller';

const ordersRouter = express.Router();
const ordersController = new OrdersController();

// Kreiranje narudžbine
ordersRouter.post('/kreirajNarudzbinu', (req, res) => ordersController.kreirajNarudzbinu(req, res));

// Dohvati narudžbine za prodavnicu
ordersRouter.get('/prodavnica/:prodavnicaId', (req, res) => ordersController.dohvatiNarudzbineZaProdavnicu(req, res));

ordersRouter.get('/kupac/:kupacId', (req, res) => ordersController.dohvatiNarudzbineZaKupca(req, res));

// Potvrdi narudžbinu
ordersRouter.put('/potvrdiNarudzbinu/:narudzbinaId', (req, res) => ordersController.potvrdiNarudzbinu(req, res));

// Postavi status narudžbine na "Poslato"
ordersRouter.put('/poslato/:narudzbinaId', (req, res) => ordersController.postaviStatusNaPoslato(req, res));

ordersRouter.put('/potvrdjeno/:narudzbinaId', (req, res) => ordersController.postaviStatusNaPotvrdjeno(req, res));

ordersRouter.get('/statistika', (req, res) => ordersController.dohvatiStatistikuNarudzbina(req, res));

export default ordersRouter;
