const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nommbre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El email es requerido'] },
    password: { type: String, required: [true, 'El password es requerido'] },
    img: { type: String, required: [false] },
    role: { type: String, required: true, default: 'USER_ROLE' },
});

module.exports = mongoose.model('Usuario', usuarioSchema);