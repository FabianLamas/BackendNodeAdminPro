const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const appRoutes = require('./routes/appRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res) => {
    if(err) throw errr;
    console.log('\x1b[32m La base de datos esta Online \x1b[0m');
})

app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
