const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Plantillas HTML por tipo
const fs = require("fs");
const templates = {
  notaria: "correo_template_nota.html",
  juridico: "correo_template_juridico.html",
  salud: "correo_template_salud.html",
  construccion: "correo_template_construccion.html",
  dependencias: "correo_template_dependencias.html",
  editoriales: "correo_template_editoriales.html",
  agencias: "correo_template_agencias.html"
};

app.post("/enviar", async (req, res) => {
  const { tipo, correo } = req.body;

  if (!templates[tipo]) {
    return res.status(400).json({ ok: false, error: "Tipo de cliente inválido" });
  }

  let html;
  try {
    html = fs.readFileSync(templates[tipo], "utf-8");
  } catch (err) {
    return res.status(500).json({ ok: false, error: "No se pudo cargar la plantilla" });
  }

  const asunto = `HM Encuadernaciones: el aliado ideal para su ${tipo}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"HM Encuadernaciones" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: asunto,
      html
    });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/ping", (req, res) => {
  res.json({ ok: true, status: "Backend activo" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});