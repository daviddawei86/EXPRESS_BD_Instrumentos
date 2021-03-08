/*
Path '/api/login'
*/

const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async(req, res = response) => {

    const { email, password } = req.body;


    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: true,
                msg: 'El email no existe'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        // Generar el token - JWT
        const token = await generarJWT(usuarioDB.id);



        res.json({
            ok: true,
            token,

        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el admin'
        });
    }
}

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    const { name, email, picture } = await googleVerify(googleToken);

    // Verifica si existe uno si ya existe no lo crea en la bd. Copia el usuario de google en mi bd mongo
    const usuarioDB = await Usuario.findOne({ email });

    // EN ECMAScript 6 no hace falta email = email ya que es redundante
    if (!usuarioDB) {
        // si no existe el usuario
        usuario = new Usuario({
            nombre: name,
            email,
            password: '@@@',
            img: picture,
            google: true
        });
    } else {
        // existe usuario
        usuario = usuarioDB;
        usuario.google = true;
        //  usuario.password = '@@@';
    }

    // Guardar en DB
    await usuario.save();

    // Generar el token - JWT
    const token = await generarJWT(usuario.id);

    try {

        await googleVerify(googleToken);

        // Desustructuramos para sacar los campos que nos interesan en nuestra aplicación
        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuario.role)
        });

    } catch (error) {

        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',

        });
    }
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el token - JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por UID
    const usuario = await Usuario.findById(uid);



    res.json({
        ok: true,
        token,
        usuario,

    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}