const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    // dev mode has no origin
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Prevented by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
