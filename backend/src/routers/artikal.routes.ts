import express from 'express';
import { ArtikalController } from '../controllers/artikal.controller';
import upload from '../config/multerConfig'; // Uvezi tvoj multer upload

// Set up multer for file uploads

const artikalRouter = express.Router();

artikalRouter.post('/dodaj', upload.array('images'), (req, res) => new ArtikalController().dodajArtikal(req, res));

artikalRouter.route('/store/:email').get(
    (req, res) => new ArtikalController().getArtikliByStore(req, res)
);

artikalRouter.route('/update/:id').put(
    (req, res) => new ArtikalController().updateArtikal(req, res)
);

artikalRouter.route('/category/:category').get(
    (req, res) => new ArtikalController().getArtikliByCategory(req, res)
);

artikalRouter.get('/artikal/:id', (req, res) => new ArtikalController().getArtikalById(req, res));

artikalRouter.get('/artikal-with-prodavnica/:id', (req, res) => new ArtikalController().getArtikalWithProdavnica(req, res));

artikalRouter.post('/novi-artikli', (req, res) => new ArtikalController().getNoviArtikliZaKorisnika(req, res));


export default artikalRouter;
