const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(bodyParser.json());

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
require('./config/passport')(passport);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
}).then(() => {
    console.log('[MongoDB] Az adatbázishoz való csatlakozás sikeres volt.');
}).catch(err => {
    console.log(`[MongoDB] Az adatbázishoz való csatlakozás sikertelen volt: ${err}`);
});

const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 50,
	standardHeaders: true,
	legacyHeaders: false,
    handler: function (req, res, next) {
        return res.status(429).send({
            success: false,
            message: 'Hé-hé! Kicsit lassíts le, és próbáld újra.'
        });
    }
});

const users = require('./routes/api/UserAPI');
const testing = require('./routes/api/TestAPI');

app.use('/testing', testing);
app.use(limiter);
app.use('/users', users);

app.listen(process.env.PORT, () => {
    console.log(`[Wolimby Account] A szerver sikeresen elindult a(z) ${process.env.PORT}-s porton.`);
});