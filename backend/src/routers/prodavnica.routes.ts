import express from 'express'
import { authMiddleware } from '../authMiddleware'
import { ProdavnicaController } from '../controllers/prodavnica.controller'
import upload from '../config/multerConfig'


const prodavnicaRouter = express.Router()

prodavnicaRouter.route('/login').post(
    (req,res)=>new ProdavnicaController().login(req, res)
)

prodavnicaRouter.route('/register').post(
    (req,res)=>new ProdavnicaController().register(req, res)
)

prodavnicaRouter.route('/checkemail').post(
    (req,res)=>new ProdavnicaController().check_email(req, res)
)

// Izmenjena ruta sa parametrom email
prodavnicaRouter.route('/email/:email').get(
    (req, res) => new ProdavnicaController().getStore(req, res)
);

prodavnicaRouter.route('/azurirajProdavnicu').put(
    (req, res) => new ProdavnicaController().azurirajProdavnicu(req, res)
)

prodavnicaRouter.post('/promeniLozinku', authMiddleware, (req, res) => new ProdavnicaController().promeniLozinku(req, res));

prodavnicaRouter.route('/:id').get(
    (req, res) => new ProdavnicaController().getProdavnicaWithArtikli(req, res)
);

prodavnicaRouter.route('/upload-profile-image').post(
    upload.single('profileImage'), // Multer middleware za upload slike
    (req, res) => new ProdavnicaController().uploadProfileImage(req, res)
  );
  


export default prodavnicaRouter