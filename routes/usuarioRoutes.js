const express = require('express');
const app = express();
const Usuario = require('../models/usuario');

app.get('/', (req, res, nex) => {

    Usuario.find( {}, (err, usuarios) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            err: err,
            usuarios: usuarios
        });
    });    
});

module.exports = app;