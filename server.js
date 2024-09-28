const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.URI_MONGOBD;
const PORT = process.env.PORT || 3000;
mongoose.connect(URI)
    .then(() => {
        console.log('Connected at MongoDB successfully!')
    })
    .catch((error) => {
        console.error('Database connection error', error)
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});