const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require('./config/db');

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes de base
app.get("/", (req, res) => {
  res.json({ message: "API e-commerce fonctionnelle" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      message: "Connexion à PostgreSQL réussie !",
      timestamp: result.rows[0].now 
    });
  } catch (err) {
    console.error('Erreur de connexion à PostgreSQL:', err);
    res.status(500).json({ 
      error: "Échec de connexion à la base de données",
      details: err.message
    });
  }
});