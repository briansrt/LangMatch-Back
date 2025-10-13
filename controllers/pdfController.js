import PDFDocument from 'pdfkit';
import stream from 'stream';
import getClient from '../db/mongo.js';
import { ObjectId } from 'mongodb';
import moment from 'moment-timezone';

export const descargarPDF = async (req, res) => {
    const client = await getClient();
    const db = client.db("LangMatch");
    const { sessionId } = req.params;
    try {
    // Buscar sesión y mensajes
    const session = await db.collection("session").findOne({ _id: new ObjectId(sessionId) });
    if (!session) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    const mensajes = await db.collection("messages")
      .find({ sessionId: new ObjectId(sessionId) })
      .sort({ timestamp: 1 })
      .toArray();

    // Crear el PDF
    const doc = new PDFDocument();
    const filename = `LangMatch_Sesion_${sessionId}.pdf`;

    // Cabecera para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Enviar el PDF como stream
    const passthrough = new stream.PassThrough();
    doc.pipe(passthrough);
    passthrough.pipe(res);

    // Contenido del PDF
    doc.fontSize(18).text('LangMatch - Conversación', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Idioma: ${session.language}`);
    doc.text(`Nivel: ${session.level}`);
    doc.text(`Fecha de inicio: ${session.startedAt}`);
    doc.text(`Fecha de fin: ${session.endedAt || 'En curso'}`);
    doc.moveDown().fontSize(14).text('Mensajes:', { underline: true }).moveDown();

    mensajes.forEach(msg => {
      const quien = msg.role === 'user' ? 'Usuario' : 'Bot';
      const fecha = moment(msg.timestamp).tz('America/Bogota').format('YYYY-MM-DD HH:mm');
      doc.fontSize(12).text(`[${fecha}] ${quien}: ${msg.text}`);
      doc.moveDown(0.5);
    });

    // Terminar PDF
    doc.end();

  } catch (error) {
    console.error("❌ Error al exportar PDF:", error);
    res.status(500).json({ message: "Error interno al generar PDF" });
  }
};