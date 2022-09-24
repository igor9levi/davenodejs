const express = require('express');
const cors = require('cors');
const path = require('path');
var morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

const app = express();

app.use(morgan('combined'));

/**
 * Middleware applied to all routes because it is above route definitions
 */
app.use(express.urlencoded({ extended: false }));

const whitelist = ['http://127.0.0.1:3000', 'http://127.0.0.1:5500'];
const corsOptions = {
  origin: (origin, callback) => {
    // dev mode has no origin
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Prevented by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Built-in middleware for json data
app.use(express.json());

// Serve static files middleware
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {});

app.all('*', (req, res) => {
  res
    .status(404)
    .json({ error: 'All HTTP method catch route - 404 Page not found' });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server up on PORT: ${PORT}`));
