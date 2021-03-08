const { response } = require('express');
const { validationResult } = require('express-validator');


const validarCampos = (req, res = response, next) => {

    const errores = validationResult(req);

    // Si hay errores
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    // Si no hay errores llamo a la función next
    next();


}

module.exports = {
    validarCampos
}