import express from 'express';
import { crearSala, enviarMensaje, finalizarSesion, obtenerMetricasGlobales, obtenerSesionesActivas } from '../controllers/sala.js';
import { descargarPDF } from '../controllers/pdfController.js';
const router = express.Router();

router.post('/crearSala', 
    /* 
      #swagger.tags = ['Sala']
      #swagger.description = 'Crea una nueva sala de conversación y envía el primer mensaje al agente.'

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            userId: "user_348EbmKDTOcpttgNGHPQDC8N6TZ",
            language: "English",
            level: "Beginner",
            nombre: "Jose"
        }
      }

      #swagger.responses[200] = {
        description: "Sala creada correctamente",
        schema: {
          status: "Sala Creada",
          fecha: "2025-01-01 12:00:00",
          sessionId: "674ff0a20e8a",
          respuesta: "Hello! Nice to meet you..."
        }
      }
    */
    crearSala);
router.post('/mensaje', 
    /* 
      #swagger.tags = ['Sala']
      #swagger.description = 'Envía un mensaje del usuario al agente y guarda la respuesta.'

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          sessionId: "691b449f7542f251a8d9d6c6",
          userId: "user_348EbmKDTOcpttgNGHPQDC8N6TZ",
          message: "Hello, how are you?"
        }
      }

      #swagger.responses[200] = {
        description: "Mensaje procesado",
        schema: {
          status: "Mensaje Enviado",
          fecha: "2025-01-01 12:00:00",
          respuesta: "I'm fine! How can I help you today?"
        }
      }
    */
    enviarMensaje);
router.post('/finalizarSession', 
    /* 
      #swagger.tags = ['Sala']
      #swagger.description = 'Finaliza una sesión y devuelve el PDF generado.'

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          sessionId: "691b449f7542f251a8d9d6c6"
        }
      }

      #swagger.responses[200] = {
        description: "PDF generado y devuelto.",
        schema: {
          message: "PDF generado correctamente"
        }
      }

      #swagger.responses[404] = { description: "Sesión no encontrada" }
    */
    finalizarSesion);
router.get('/stats/global', 
    /* 
      #swagger.tags = ['Sala']
      #swagger.description = 'Devuelve métricas globales de uso de la aplicación.'

      #swagger.responses[200] = {
        description: "Métricas globales",
        schema: {
          totalMensajes: 200,
          totalSesiones: 50,
          idiomaMasPracticado: "English",
          nivelMasElegido: "A2",
          promedioDuracionMin: "10.5",
          promedioMensajesPorSesion: "16.8",
          totalUsuarios: 100
        }
      }
    */
    obtenerMetricasGlobales);
router.get('/activas', 
    /* 
      #swagger.tags = ['Sala']
      #swagger.description = 'Devuelve la lista de sesiones activas.'

      #swagger.responses[200] = {
        description: "Sesiones activas",
        schema: {
          total: 1,
          sesiones: [
            {
              sessionId: "674ff0a20e8a",
              userId: "123",
              usuario: "John Doe",
              language: "English",
              level: "A2",
              startedAt: "2025-01-01 12:00:00"
            }
          ]
        }
      }
    */
    obtenerSesionesActivas);
router.get('/session/:sessionId/export-pdf', 
    /* 
      #swagger.tags = ['Sala']
      #swagger.description = 'Exporta en PDF la conversación completa de la sesión.'

      #swagger.parameters['sessionId'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'ID de la sesión.'
      }

      #swagger.responses[200] = {
        description: "PDF generado",
        schema: {
            message: "PDF exportado correctamente"
        }
      }
    */
    descargarPDF);

export default router;