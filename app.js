const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
require('./config/passport')(passport);
const { specs, swaggerUi } = require('./services/swagger');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(morgan(formatsLogger));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const authRouter = require('./routes/auth');
const needHelpRouter = require('./routes/help');

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Task Pro API!' });
});
app.use('/api/auth', authRouter);
app.use('/api', needHelpRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app;