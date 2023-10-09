const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');

const authRouter = require('./routes/auth').router;
const itemsRouter = require('./routes/items');

const app = express();

const PORT = process.env.PORT || 3001;
const SECRET_KEY = 'your_access_token_secret';  // Assurez-vous d'utiliser une clé secrète robuste et unique

dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware d'authentification par token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);  // Si aucun token n'est fourni

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);  // Si le token est invalide
        req.user = user;
        next();  // Si tout va bien, continuez à traiter la requête
    });
}


// Routes
app.use('/auth', authRouter);

// Appliquer le middleware d'authentification aux routes nécessitant une authentification
app.use('/items', itemsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
