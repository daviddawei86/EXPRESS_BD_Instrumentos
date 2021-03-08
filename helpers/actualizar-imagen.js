const Usuario = require('../models/usuario');
const Valvula = require('../models/valvula');
const fs = require('fs');

const borrarImagen = (path) => {

    if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
    }

}



const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';

    switch (tipo) {

        case 'valvulas':

            const valvula = await Valvula.findById(id);
            if (!valvula) {
                console.log('No es una válvula por id');
                return false;
            }

            pathViejo = `./uploads/valvulas/${ valvula.img }`;
            borrarImagen(pathViejo);

            valvula.img = nombreArchivo;
            await valvula.save();
            return true;

            break;

        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No es un usuario por id');
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

            break;

        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}