const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// Rutas import
const appRoutes = require('./routes/appRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const loginRoutes = require('./routes/LoginRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const busquedaRoutes = require('./routes/busquedaRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const imagenesRoutes = require('./routes/imagenesRoutes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, ( err, res) => {
    if(err) throw errr;
    console.log('\x1b[32m La base de datos esta Online \x1b[0m');
});
mongoose.set('useCreateIndex', true)

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
