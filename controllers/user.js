import getClient from "../db/mongo.js";
import moment from "moment-timezone";

export const crearUser = async (req, res) => {
    const client = await getClient();
    try {

    const event = req.body;
    if (event.type === "user.created") {
      const data = event.data;
      await client.db('LangMatch').collection('users').insertOne({
        userId: data.id,
        email: data.email_addresses[0].email_address || data.primary_email_address_id,
        firstName: data.first_name,
        lastName: data.last_name,
        createdAt: new Date(),
      });
    }

    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

export const obtenerMetricasUsuario = async (req, res) => {
  const client = await getClient();
  const { userId } = req.params;

  try {
    const db = client.db("LangMatch");

    // 1️⃣ Total de mensajes enviados por el usuario
    const totalMensajesUsuario = await db.collection("messages").countDocuments({ userId, role: "user" });

    // 2️⃣ Total de mensajes del bot (opcional)
    const totalMensajesBot = await db.collection("messages").countDocuments({ role: "bot", "sessionId": { $in: await db.collection("session").distinct("_id", { userId }) } });

    // 3️⃣ Número total de sesiones
    const totalSesiones = await db.collection("session").countDocuments({ userId });

    // 4️⃣ Duración total de práctica y promedio por sesión
    const sesiones = await db.collection("session").find({ userId }).toArray();
    let duracionTotalMin = 0;
    sesiones.forEach(s => {
      if (s.startedAt && s.endedAt) {
        const start = new Date(s.startedAt);
        const end = new Date(s.endedAt);
        duracionTotalMin += (end - start) / 60000; // minutos
      }
    });
    const promedioDuracion = totalSesiones > 0 ? duracionTotalMin / totalSesiones : 0;

    // 5️⃣ Idiomas practicados y frecuencia
    const idiomas = await db.collection("session").aggregate([
      { $match: { userId } },
      { $group: { _id: "$language", count: { $sum: 1 } } }
    ]).toArray();

    // 6️⃣ Niveles usados y frecuencia
    const niveles = await db.collection("session").aggregate([
      { $match: { userId } },
      { $group: { _id: "$level", count: { $sum: 1 } } }
    ]).toArray();

    // 7️⃣ Promedio de mensajes por sesión
    const mensajesPorSesion = await db.collection("messages").aggregate([
      { $match: { userId } },
      { $group: { _id: "$sessionId", count: { $sum: 1 } } }
    ]).toArray();
    const promedioMensajesPorSesion = mensajesPorSesion.length > 0
      ? mensajesPorSesion.reduce((a, b) => a + b.count, 0) / mensajesPorSesion.length
      : 0;

    // 8️⃣ Última sesión
    const ultimaSesion = await db.collection("session")
      .find({ userId })
      .sort({ startedAt: -1 })
      .limit(1)
      .toArray();

    // 9️⃣ Clasificación de actividad (activo, ocasional, inactivo)
    let actividad = "Inactivo";
    if (ultimaSesion.length > 0) {
      const diasUltima = moment().diff(moment(ultimaSesion[0].startedAt), "days");
      if (diasUltima <= 2) actividad = "Activo";
      else if (diasUltima <= 7) actividad = "Ocasional";
    }

    res.json({
      userId,
      totalMensajesUsuario,
      totalMensajesBot,
      totalSesiones,
      duracionTotalMin: duracionTotalMin.toFixed(2),
      promedioDuracionMin: promedioDuracion.toFixed(2),
      idiomas: idiomas.map(i => ({ idioma: i._id, sesiones: i.count })),
      niveles: niveles.map(n => ({ nivel: n._id, sesiones: n.count })),
      promedioMensajesPorSesion: promedioMensajesPorSesion.toFixed(2),
      ultimaSesion: ultimaSesion[0]?.startedAt || null,
      actividad
    });

  } catch (error) {
    console.error("❌ Error al obtener métricas:", error);
    res.status(500).json({ status: "Error", message: "Error interno del servidor" });
  }
};

export const obtenerListaUsuarios = async (req, res) => {
  const client = await getClient();
  const db = client.db("LangMatch");

  try {
    const usuarios = await db.collection("users")
      .find({}, { projection: { _id: 0, userId: 1, firstName: 1, lastName: 1, email: 1, createdAt: 1 } })
      .toArray();

    res.json({ total: usuarios.length, usuarios });
  } catch (error) {
    console.error("❌ Error al obtener lista de usuarios:", error);
    res.status(500).json({ status: "Error", message: "Error interno del servidor" });
  }
};

