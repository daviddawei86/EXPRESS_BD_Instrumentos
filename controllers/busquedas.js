const { response } = require('express');

const Usuario = require('../models/usuario');
const Valvula = require('../models/valvula');

// getTodo
const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');



    const [usuarios, valvulas] = await Promise.all([

        Usuario.find({ nombre: regex }),
        Valvula.find({ nombre: regex }),



    ])

    res.json({
        ok: true,
        usuarios,
        valvulas


    })
}


const getDocumentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {

        case 'valvulas':
            data = await Valvula.find({ nombre: regex })
                .populate('usuario', 'nombre img');

            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/valvulas'
            });

    }

    res.json({
        ok: true,
        resultados: data
    })


}

module.exports = {
    getTodo,
    getDocumentosColeccion
}