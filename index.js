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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  process.env.FRONTEND_URL_3,
  process.env.FRONTEND_URL_4,
  undefined 
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origin (por ejemplo, curl o mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Bloqueado por CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use('/user', userRoutes);
app.use('/sala', salaRoutes);

app.get('/', (req, res) => {
    res.send('¡Hola, mundo! y !Hola LangMatch¡');
});

app.listen(port, ()=>{
    console.log(`listening at port http://localhost:${port}`);
})
