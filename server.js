const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');

const verifyJWT = require('./middleware/verifyJWT');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

const app = express();

app.use(morgan('combined'));

/**
 * Middleware applied to all routes because it is above route definitions
 */
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions));

// Built-in middleware for json data
app.use(express.json());
app.use(cookieParser());

// Serve static files middleware
// __dirname current directory path of this file
// default dir for static is "/". If we need subdir statics, we need to add that route
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/index'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

/**
 * This works as waterfall. Previous routes won't be protected by verify token middleware
 * because they are public or necessary routes. Every route below this middleware will be
 * protected
 * */
app.use(verifyJWT);

app.use('/employees', require('./routes/api/employees'));

// app.get('/', (req, res) => {});

app.all('*', (req, res) => {
  res
    .status(404)
    .json({ error: 'All HTTP method catch route - 404 Page not found' });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server up on PORT: ${PORT}`));
