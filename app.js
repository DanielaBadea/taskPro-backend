const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
require('./config/passport')(passport);

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(morgan(formatsLogger));

app.use((res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, res) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).send('Something broke!'); 
});
module.exports = app;