const { response } = require('express');
const Valvula = require('../models/valvula');

const getValvulas = async(req, res = response) => {

    const valvulas = await Valvula.find()
        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        valvulas
    })
}

const crearValvula = async(req, res = response) => {

    const uid = req.uid;
    const valvula = new Valvula({
        usuario: uid,
        ...req.body
    });

    try {

        const instrumentosDB = await valvula.save();

        res.json({
            ok: true,
            valvula: instrumentosDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarValvula = async(req, res) => {

    const id = req.params.id;
    // disponemos de la uid porque pasamos por la autentificacion web token
    const uid = req.uid;

    try {

        const valvula = await Valvula.findById(id);

        if (!valvula) {
            return res.status(404).json({
                ok: true,
                msg: 'Válvula no encontrada',

            });
        }

        const cambiosValvula = {
            ...req.body,
            usuario: uid
        }

        // new true para que regrese el documento actualizadp
        const valvulaActualizado = await Valvula.findByIdAndUpdate(id, cambiosValvula, { new: true });

        res.json({
            ok: true,
            valvula: valvulaActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const borrarValvula = async(req, res) => {

    const id = req.params.id;


    try {

        const valvula = await Valvula.findById(id);

        if (!valvula) {
            return res.status(404).json({
                ok: true,
                msg: 'Valvula no encontrada',

            });
        }

        await Valvula.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Valvula eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}



const getValvulaById = async(req, res = response) => {

    const id = req.params.id;

    try {

        const valvula = await Valvula.findById(id)
            .populate('usuario', 'nombre img')


        res.json({
            ok: true,
            valvula
        })

    } catch (error) {
        console.log(error)
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getValvulas,
    crearValvula,
    actualizarValvula,
    borrarValvula,
    getValvulaById,
}