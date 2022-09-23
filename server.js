const express = require('express');
const app = express();
const cors = require('cors');

const path = require('path');
const PORT = process.env.PORT || 3500;

/**
 * Middleware applied to all routes because it is above route definitions
 */
app.use(express.urlencoded({ extended: false }));

const whitelist = ['http://127.0.0.1:3000', 'http://127.0.0.1:5500'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
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

app.listen(PORT, () => console.log(`Server up on PORT: ${PORT}`));
