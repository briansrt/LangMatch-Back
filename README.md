# 🧠 LangMatch – Backend

Backend del proyecto **LangMatch**, un sistema educativo interactivo que permite a los usuarios practicar idiomas mediante conversaciones con un agente IA (AWS Bedrock).  
El sistema incluye autenticación, manejo de sesiones, generación de métricas globales y por usuario, y exportación de conversaciones en PDF.

---

## 🚀 Tecnologías Utilizadas

| Componente | Tecnología |
|-------------|-------------|
| **Backend** | Node.js + Express |
| **Base de datos** | MongoDB Atlas |
| **IA Conversacional** | AWS Bedrock (InvokeAgentCommand) |
| **Autenticación** | Clerk (Webhook user.created) |
| **Generación de PDF** | PDFKit |
| **Variables de entorno** | dotenv |
| **Timestamps** | moment-timezone |

---

## ⚙️ Instalación Local

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/langmatch-backend.git
cd langmatch-backend
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Crear el archivo `.env` en la raíz del proyecto

Ejemplo de configuración:

```env
PORT=4000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY_ID=tu_secret_key
BEDROCK_AGENT_ID=tu_agente_id
BEDROCK_AGENT_ALIAS_ID=tu_alias_id
```

### 4️⃣ Ejecutar el servidor

```bash
npm start
```

Servidor disponible en:  
👉 `http://localhost:4000`

---

## 📦 Estructura del Proyecto

```
📁 langmatch-backend
├── index.js
├── .env
├── package.json
├── db/
│   └── mongo.js
├── controllers/
│   ├── user.js
│   ├── sala.js
│   └── pdfController.js
├── routes/
│   ├── userRoutes.routes.js
│   └── salaRoutes.routes.js
└── README.md
```

---

## 🌐 Despliegue en AWS

### 🖥️ Backend en EC2

1️⃣ **Crear una instancia EC2** (Ubuntu o Amazon Linux).  
2️⃣ Instalar Node.js y Git:

```bash
sudo apt update
sudo apt install -y nodejs npm git
```

3️⃣ **Clonar tu repositorio**:

```bash
git clone https://github.com/tuusuario/langmatch-backend.git
cd langmatch-backend
npm install
```

4️⃣ **Configurar variables de entorno** (archivo `.env` o exportarlas en el sistema).

5️⃣ **Ejecutar con PM2 (opcional)** para mantenerlo activo:

```bash
npm install -g pm2
pm2 start index.js --name langmatch-backend
pm2 save
pm2 startup
```

6️⃣ Configurar **puerto 4000** en el **Security Group** de AWS.

---

### 🌩️ Frontend en S3 + CloudFront (si aplica)

- Subir el build del frontend React al bucket S3.
- Activar hosting estático.
- Distribuir globalmente con CloudFront y vincular un dominio (opcional).

---

## 🧩 Endpoints Principales

### 🧍‍♂️ Usuarios (`/user`)
| Método | Ruta | Descripción |
|--------|-------|-------------|
| `POST` | `/user/crearUser` | Crea un usuario (recibe evento Clerk `user.created`) |
| `GET` | `/user/listaUsers` | Retorna lista de usuarios registrados |
| `GET` | `/user/stats/:userId` | Devuelve métricas detalladas del usuario |

📘 **Ejemplo:**
```json
GET /user/stats/123
{
  "userId": "123",
  "totalMensajesUsuario": 45,
  "totalSesiones": 3,
  "idiomas": [{"idioma": "inglés", "sesiones": 2}],
  "actividad": "Activo"
}
```

---

### 💬 Sesiones / Salas (`/sala`)

| Método | Ruta | Descripción |
|--------|-------|-------------|
| `POST` | `/sala/crearSala` | Crea una sesión y envía el primer mensaje al bot |
| `POST` | `/sala/mensaje` | Envía un mensaje del usuario al bot |
| `POST` | `/sala/finalizarSession` | Finaliza sesión y genera PDF |
| `GET` | `/sala/stats/global` | Obtiene métricas globales |
| `GET` | `/sala/activas` | Muestra sesiones activas (sin finalizar) |
| `GET` | `/sala/session/:sessionId/export-pdf` | Exporta conversación a PDF |

📘 **Ejemplo de creación de sala:**
```json
POST /sala/crearSala
{
  "userId": "123",
  "language": "English",
  "level": "Beginner",
  "nombre": "Brian"
}
```

📗 **Respuesta:**
```json
{
  "status": "Sala Creada",
  "fecha": "2025-10-17 10:23:00",
  "sessionId": "66f8a3a7c5...",
  "respuesta": "Hello Brian! Let's start practicing your English..."
}
```

---

## 🧰 Variables y Configuración

| Variable | Descripción |
|-----------|-------------|
| `PORT` | Puerto del servidor Express |
| `MONGO_URI` | URI de conexión a MongoDB Atlas |
| `AWS_REGION` | Región donde está desplegado Bedrock |
| `AWS_ACCESS_KEY_ID` | Clave pública AWS |
| `AWS_SECRET_ACCESS_KEY_ID` | Clave privada AWS |
| `BEDROCK_AGENT_ID` | ID del agente Bedrock |
| `BEDROCK_AGENT_ALIAS_ID` | ID del alias del agente Bedrock |

---

## 🪵 Logs y Timestamps

Todas las inserciones en MongoDB almacenan timestamps con zona horaria de Bogotá (`America/Bogota`), asegurando trazabilidad de mensajes y sesiones.

---

## 🧾 Autor

👨‍💻 **Brian Riofrio**  
Estudiante de Ingeniería de Sistemas  
Proyecto: **LangMatch – Chatbot Educativo Multilingüe**  
Backend desarrollado con **Node.js + Express + MongoDB + AWS Bedrock**
