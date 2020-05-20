const express = require('express');
const app = express();
const Medico = require('../models/medico');
const bcrypt = require('bcryptjs');
const middleware = require('../middlewares/autenticacion');


// GET ALL medicos
app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                })
            });
});

// GET medico by ID
// app.get('/:id', (req, res) => {

//     const id = req.params.id;

//     Medico.findById(id)
//         .populate('usuario', 'nombre email img')
//         .populate('hospital')
//         .exec((err, medico) => {

//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     mensaje: 'Error al buscar medico',
//                     errors: err
//                 });
//             }

//             if (!medico) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'El medico con el id ' + id + ' no existe',
//                     errors: { message: 'No existe un medico con ese ID' }
//                 });
//             }

//             res.status(200).json({
//                 ok: true,
//                 medico: medico
//             });
//         })
// });

// POST medico
app.post('/', middleware.verificaToken, (req, res) => {
    
    const body = req.body;
    
    const medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

// PUT usuario
app.put('/:id', middleware.verificaToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }


        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

// DELETE medico
app.delete('/:id', middleware.verificaToken, (req, res) => {

    const id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});


module.exports = app;