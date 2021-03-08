const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },

});

// Cambia el nombre _id (porDefecto en mongo) por uid para finales visuales no afecta a la base de datos
// password lo quita para que no lo regrese
UsuarioSchema.method('toJSON', function() {
    // saca   _v , _id , password  y solo envia el object con el nombre con la id modificada
    const { _v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);