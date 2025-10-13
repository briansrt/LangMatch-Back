import express from 'express';
import { crearUser, obtenerMetricasUsuario} from '../controllers/user.js';
const router = express.Router();

router.post('/crearUser', crearUser);
router.get('/stats/:userId', obtenerMetricasUsuario);

export default router;