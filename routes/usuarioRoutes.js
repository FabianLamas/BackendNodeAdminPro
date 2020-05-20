const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const middleware = require('../middlewares/autenticacion');

// GET ALL usuarios
app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find( {}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec( (err, usuarios) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });

            });
        });    
});

// POST usuario
app.post('/', middleware.verificaToken ,(req, res, next) => {

    const body = req.body;
    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        img: body.img,
        role: body.role
    })

    usuario.save( (err, usuarioGuardado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar el usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        })
    });
});

// PUT usuario
app.put('/:id', middleware.verificaToken,(req, res, next) => {
    const id = req.params.id;
    const body = req.body;

    Usuario.findById( id, 'nombre email img role _id ' ,(err, usuario) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: `El usaurio con id: ${id} no existe`,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// DELETE usuario
app.delete('/:id',middleware.verificaToken, (req, res, next) => {
    const id = req.params.id;

    Usuario.findByIdAndDelete( id, (err, usuarioBorrado) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: `El usaurio con id: ${id} no existe`,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;