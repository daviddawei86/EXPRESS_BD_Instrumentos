/*
    Valvulas
    ruta:'/api/valvulas'  Declarada en el middleware del index
*/

const { Router } = require('express');
//Paquete instalado ver documentación de validator para crear los middlewares
const { check } = require('express-validator');
// LLamamos middleware personalizado de validación
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getValvulas,
    crearValvula,
    actualizarValvula,
    borrarValvula,
    getValvulaById
} = require('../controllers/valvulas')

const router = Router();

router.get('/', getValvulas);

router.post('/', [
        validarJWT,
        check('nombre', 'El nombre de la válvula es necesario').not().isEmpty(),
        validarCampos
    ],
    crearValvula
);

router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre de la válvula es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarValvula
);

router.delete('/:id',
    validarJWT,
    borrarValvula
);

router.get('/:id',
    validarJWT,
    getValvulaById
);


module.exports = router;