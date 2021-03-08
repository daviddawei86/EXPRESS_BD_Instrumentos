const { Schema, model } = require('mongoose');

const ValvulaSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    zona: {
        type: String,
    },
    sector: {
        type: String,
    },
    PI: {
        type: String,
    },
    instalado: {
        type: Boolean,
    },
    fecha: {
        type: Date,
    },


    // Mongo añade una s al final valvulas(s) .
}, { collection: 'valvulas' });

// Cambia el nombre _id (porDefecto en mongo) por uid para finales visuales no afecta a la base de datos
// password lo quita para que no lo regrese
ValvulaSchema.method('toJSON', function() {
    const { _v, ...object } = this.toObject();
    return object;
})

module.exports = model('Valvula', ValvulaSchema);