import express from 'express';
import { crearUser, obtenerListaUsuarios, obtenerMetricasUsuario} from '../controllers/user.js';
const router = express.Router();

router.post('/crearUser', crearUser);
router.get('/stats/:userId', obtenerMetricasUsuario);
router.get('/listaUsers', obtenerListaUsuarios);


export default router;