import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import korisnikRouter from './routers/korisnik.routes';
import prodavnicaRouter from './routers/prodavnica.routes';
import artikalRouter from './routers/artikal.routes';
import ordersRouter from './routers/order.routes';
import reviewRouter from './routers/review.routes';
import aiRoutes from './aiRoutes';


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/diplomskiDB');
const connection = mongoose.connection;
connection.once('open',  ()=> {
    console.log('db connected');
})

const router = express.Router();
router.use('/korisnik', korisnikRouter)
router.use('/prodavnica', prodavnicaRouter)
router.use('/artikal', artikalRouter)
router.use('/orders', ordersRouter)
router.use('/recenzije', reviewRouter)


app.use(aiRoutes);        
app.use('/', router)
app.use('/uploads', express.static('uploads'));
app.listen(4000, () => console.log(`Express server running on port 4000`));