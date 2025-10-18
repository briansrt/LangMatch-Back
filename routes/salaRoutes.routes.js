import express from 'express';
import { crearSala, enviarMensaje, finalizarSesion, obtenerMetricasGlobales, obtenerSesionesActivas } from '../controllers/sala.js';
import { descargarPDF } from '../controllers/pdfController.js';
const router = express.Router();

router.post('/crearSala', crearSala);
router.post('/mensaje', enviarMensaje);
router.post('/finalizarSession', finalizarSesion);
router.get('/stats/global', obtenerMetricasGlobales);
router.get('/activas', obtenerSesionesActivas);
router.get('/session/:sessionId/export-pdf', descargarPDF);

export default router;