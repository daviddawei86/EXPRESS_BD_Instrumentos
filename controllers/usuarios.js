const { response } = require('express');
const bcrypt = require('bcryptjs');
// Llamamos modelo usuario
const Usuario = require('../models/usuario');
const { findByIdAndDelete } = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    // Paginación desde
    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        // Te busca los usuarios usando el modelo , usa el filtro con claudator y solo saca nombre email etc...
        // PAGINACIÓN skip limit etc...
        // Primera posición del arreglo
        Usuario
        .find({}, 'nombre email role google img')
        .skip(desde)
        .limit(5),
        // Segunda posición del arreglo
        Usuario.countDocuments()
    ]);
    // Primero pasa por el middleware de las router.post del fichero routes y el resultado lo controlamos con el result
    res.json({
        ok: true,
        usuarios,
        total
    });
};



const crearUsuario = async(req, res = response) => {

    // Leemos el body con req.body de nuestro esquema
    const { email, password } = req.body;


    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: true,
                msg: 'El correo ya está registrado'
            });
        }



        //Creamos instancia del modelo usuario
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);





        // await espera que esta promesa termine , hace falta siempre poner el async
        await usuario.save();

        // Generar el token - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto.
    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }


        // Actualizaciones
        // Quito el password y google para que no cambien.
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email '
                })
            }
        }

        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar su correo'
            });
        }


        // la bd se actualiza bien pero moongose visualiza el anterior. Poner new:true para que salga el nuevo
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el admin'
        });
    }

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}