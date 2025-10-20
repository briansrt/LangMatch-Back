import express, { urlencoded, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.routes.js';
import salaRoutes from './routes/salaRoutes.routes.js';
dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(urlencoded({extended: true}))
app.use(json())


app.use(cors({
  origin: 'https://d1yw6dixmekuzw.cloudfront.net',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));


app.use('/api/user', userRoutes);
app.use('/api/sala', salaRoutes);

app.get('/', (req, res) => {
    res.send('¡Hola, mundo! y !Hola LangMatch¡');
});

app.listen(port, '0.0.0.0', ()=>{
    console.log(`listening at port http://0.0.0.0:${port}`);
})
