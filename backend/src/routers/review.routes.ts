import express from 'express';
import { authMiddleware } from '../authMiddleware';
import { RecenzijaController } from '../controllers/review.controller';

const reviewRouter = express.Router();

reviewRouter.post('/dodajRecenziju', authMiddleware, (req, res) => new RecenzijaController().dodajRecenziju(req, res));

reviewRouter.get('/dohvatiRecenzije/:prodavnicaId', (req, res) => new RecenzijaController().dohvatiRecenzije(req, res)); // Novi endpoint


export default reviewRouter;
