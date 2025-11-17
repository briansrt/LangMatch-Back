import express from 'express';
import { crearUser, obtenerListaUsuarios, obtenerMetricasUsuario} from '../controllers/user.js';
const router = express.Router();

router.post('/crearUser', 
    /* 
      #swagger.tags = ['Usuarios']
      #swagger.description = 'Registra un nuevo usuario cuando el evento Clerk user.created llega al backend.'

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Evento enviado por Clerk u otro servicio de autenticación.',
        schema: {
          type: "user.created",
          data: {
            id: "usr_123456",
            first_name: "Carlos",
            last_name: "Pérez",
            email_addresses: [
              { email_address: "carlos@mail.com" }
            ]
          }
        }
      }

      #swagger.responses[200] = {
        description: "Usuario registrado correctamente.",
        schema: "ok"
      }

      #swagger.responses[500] = { description: "Server error" }
    */
    crearUser);
router.get('/stats/:userId', 
    /* 
      #swagger.tags = ['Usuarios']
      #swagger.description = 'Devuelve métricas completas de un usuario específico.'

      #swagger.parameters['userId'] = {
        in: 'path',
        required: true,
        description: 'ID del usuario.',
        type: 'string'
      }

      #swagger.responses[200] = {
        description: "Métricas del usuario",
        schema: {
          userId: "usr_12345",
          totalMensajesUsuario: 50,
          totalMensajesBot: 50,
          totalSesiones: 10,
          duracionTotalMin: "120.50",
          promedioDuracionMin: "12.05",
          idiomas: [
            { idioma: "English", sesiones: 5 },
            { idioma: "Spanish", sesiones: 5 }
          ],
          niveles: [
            { nivel: "Advanced", sesiones: 4 },
            { nivel: "Beginner", sesiones: 6 }
          ],
          promedioMensajesPorSesion: "10.00",
          ultimaSesion: "2025-01-15 12:00:00",
          actividad: "Activo"
        }
      }

      #swagger.responses[404] = { description: "Usuario no encontrado" }
      #swagger.responses[500] = { description: "Error interno del servidor" }
    */
    obtenerMetricasUsuario);
router.get('/listaUsers', 
    /* 
      #swagger.tags = ['Usuarios']
      #swagger.description = 'Obtiene la lista completa de usuarios registrados.'

      #swagger.responses[200] = {
        description: "Lista de usuarios",
        schema: {
          total: 2,
          usuarios: [
            {
              userId: "usr_123",
              firstName: "Juan",
              lastName: "Pérez",
              email: "juan@mail.com",
              createdAt: "2025-01-01T12:00:00Z"
            },
            {
              userId: "usr_456",
              firstName: "Ana",
              lastName: "García",
              email: "ana@mail.com",
              createdAt: "2025-01-05T12:00:00Z"
            }
          ]
        }
      }

      #swagger.responses[500] = { description: "Error interno del servidor" }
    */
    obtenerListaUsuarios);


export default router;