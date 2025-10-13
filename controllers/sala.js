import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import getClient from "../db/mongo.js";
import { descargarPDF } from './pdfController.js'; // ajusta el path según tu estructura
import { ObjectId } from "mongodb";
import moment from "moment-timezone";
import dotenv from 'dotenv';
dotenv.config();

const Bedrockclient = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  },
});

export const crearSala = async (req, res) => {
    const client = await getClient();
    const { userId, language, level, nombre } = req.body;

    if (!userId || !language || !level || !nombre) {
        return res.status(400).json({ status: "Error", message: "Faltan campos requeridos" });
    }

    const message = `Hola, mi nombre es ${nombre} y mi nivel de ${language} es ${level}`;
    const currentDateTime = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

    try {
        console.log("🧩 Insertando sesión en MongoDB...");
        const result = await client.db('LangMatch').collection('session').insertOne({
            userId,
            language,
            level,
            startedAt: currentDateTime,
            endedAt: null
        });

        const sessionId = result.insertedId.toString();
        console.log("✅ Sesión creada con ID:", sessionId);

        const command = new InvokeAgentCommand({
            agentId: process.env.BEDROCK_AGENT_ID,
            agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID,
            sessionId,
            inputText: message
        });

        console.log("📡 Enviando mensaje al agente de Bedrock...");
        const response = await Bedrockclient.send(command);
        let messageBot = "⚠️ El agente no devolvió contenido.";
        if (response.completion) {
            const dec = new TextDecoder();
            let text = "";
            for await (const ev of response.completion) {
                if (ev.chunk?.bytes) text += dec.decode(ev.chunk.bytes);
            }
            messageBot = text || messageBot;
        }

        console.log("✅ Respuesta del bot:", messageBot);
        const botTimestamp = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

        await client.db('LangMatch').collection('messages').insertOne({
            sessionId: new ObjectId(sessionId),
            role: "bot",
            text: messageBot,
            timestamp: botTimestamp
        });
        

        return res.json({
            status: "Sala Creada",
            fecha: currentDateTime,
            sessionId,
            respuesta: messageBot
        });
    } catch (error) {
        console.error('❌ Error al crear la sala:', error);
        return res.status(500).json({ status: "Error", message: "Error interno del servidor" });
    }
};

export const enviarMensaje = async (req, res) => {
    const client = await getClient();
    const { sessionId, userId, message } = req.body;

    try {
        const currentDateTime = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
        await client.db('LangMatch').collection('messages').insertOne({
            sessionId: new ObjectId(sessionId),
            userId,
            role: "user",
            text: message,
            timestamp: currentDateTime
        });

        const command = new InvokeAgentCommand({
            agentId: process.env.BEDROCK_AGENT_ID,
            agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID,
            sessionId,
            inputText: message,
        });

        const response = await Bedrockclient.send(command);
        let messageBot = "⚠️ El agente no devolvió contenido.";
        if (response.completion) {
            const dec = new TextDecoder();
            let text = "";
            for await (const ev of response.completion) {
                if (ev.chunk?.bytes) text += dec.decode(ev.chunk.bytes);
            }
            messageBot = text || messageBot;
        }

        console.log("✅ Respuesta del bot:", messageBot);
        const botTimestamp = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

        // Guardar respuesta del bot
        await client.db('LangMatch').collection('messages').insertOne({
            sessionId: new ObjectId(sessionId),
            role: "bot",
            text: messageBot,
            timestamp: botTimestamp
        });

        res.json({ status: "Mensaje Enviado", fecha: botTimestamp, respuesta: messageBot });
    } catch (error) {
        console.error('Error al enviar el mensaje', error);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
}


export const obtenerMetricasGlobales = async (req, res) => {
  const client = await getClient();
  const db = client.db("LangMatch");

  try {
    // 1️⃣ Total de mensajes (usuario + bot)
    const totalMensajes = await db.collection("messages").countDocuments();

    // 2️⃣ Total de sesiones creadas
    const totalSesiones = await db.collection("session").countDocuments();

    // 3️⃣ Idioma más practicado
    const idiomaMasPracticadoAgg = await db.collection("session").aggregate([
      { $group: { _id: "$language", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    const idiomaMasPracticado = idiomaMasPracticadoAgg[0]?._id || "N/A";

    // 4️⃣ Nivel más elegido
    const nivelMasElegidoAgg = await db.collection("session").aggregate([
      { $group: { _id: "$level", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    const nivelMasElegido = nivelMasElegidoAgg[0]?._id || "N/A";

    // 5️⃣ Promedio de duración por sesión
    const sesiones = await db.collection("session").find().toArray();
    let duracionTotalMin = 0;
    let sesionesConDuracion = 0;
    sesiones.forEach(s => {
      if (s.startedAt && s.endedAt) {
        const start = new Date(s.startedAt);
        const end = new Date(s.endedAt);
        duracionTotalMin += (end - start) / 60000; // minutos
        sesionesConDuracion++;
      }
    });
    const promedioDuracion = sesionesConDuracion > 0 ? duracionTotalMin / sesionesConDuracion : 0;

    // 6️⃣ Promedio de mensajes por sesión
    const mensajesPorSesion = await db.collection("messages").aggregate([
      { $group: { _id: "$sessionId", count: { $sum: 1 } } }
    ]).toArray();
    const promedioMensajesPorSesion = mensajesPorSesion.length > 0
      ? mensajesPorSesion.reduce((a, b) => a + b.count, 0) / mensajesPorSesion.length
      : 0;

    // 7️⃣ Total de usuarios registrados
    const totalUsuarios = await db.collection("users").countDocuments();

    // 📦 Respuesta
    res.json({
      totalMensajes,
      totalSesiones,
      idiomaMasPracticado,
      nivelMasElegido,
      promedioDuracionMin: promedioDuracion.toFixed(2),
      promedioMensajesPorSesion: promedioMensajesPorSesion.toFixed(2),
      totalUsuarios
    });

  } catch (error) {
    console.error("❌ Error al obtener métricas globales:", error);
    res.status(500).json({ status: "Error", message: "Error interno del servidor" });
  }
};

export const finalizarSesion = async (req, res) => {
  const client = await getClient();
  const db = client.db("LangMatch");
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ status: "Error", message: "Falta el ID de la sesión" });
  }

  try {
    const endedAt = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

    const result = await db.collection('session').updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { endedAt } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ status: "Error", message: "Sesión no encontrada" });
    }

    // ✅ Reusar el controlador del PDF directamente
    // Simulamos una request GET con el sessionId como parámetro
    req.params = { sessionId }; // aseguramos que el controlador PDF tenga lo que necesita

    // Llama al controlador de PDF, pasa req y res directamente
    return descargarPDF(req, res);

  } catch (error) {
    console.error("❌ Error al finalizar sesión:", error);
    res.status(500).json({ status: "Error", message: "Error interno del servidor" });
  }
};
