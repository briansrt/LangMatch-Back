import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API LangMatch",
    description: "Documentación de la API para la gestión de idiomas y traducciones.",
  },
  host: "lang-match-back.vercel.app",
  schemes: ["https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
