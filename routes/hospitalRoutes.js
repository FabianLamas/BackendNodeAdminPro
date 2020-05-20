const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const middleware = require('../middlewares/autenticacion');

// GET ALL Hospitales
app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                })

            });
});

// GET by Id Hospital
// app.get('/:id', (req, res) => {

//     const id = req.params.id;

//     Hospital.findById(id)
//         .populate('usuario', 'nombre img email')
//         .exec((err, hospital) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     mensaje: 'Error al buscar hospital',
//                     errors: err
//                 });
//             }

//             if (!hospital) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'El hospital con el id ' + id + 'no existe',
//                     errors: { message: 'No existe un hospital con ese ID' }
//                 });
//             }
//             res.status(200).json({
//                 ok: true,
//                 hospital: hospital
//             });
//         })
// })


// PUT hospital
app.put('/:id', middleware.verificaToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }


        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});


// POST hopital
app.post('/', middleware.verificaToken, (req, res) => {

    const body = req.body;

    const hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});


// DELETE hospital 
app.delete('/:id', middleware.verificaToken, (req, res) => {

    const id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});


module.exports = app;