
const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/user');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


const router = Router();

router.get( '/',[
    // check('limite','No es un número').isNumeric(),
    // validarCampos
] , usuariosGet );

router.put( '/:id', [
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ), 
    validarCampos
] ,usuariosPut );

router.post( '/', [
    check('nombre','El nombre es obligatorio').not().isEmpty(), //Valida que NO este vacio
    check('password','El password debe ser más de 6 letras').isLength({ min: 6 }), 
    check('correo','El correo no es válido').isEmail().custom( emailExiste ),
    // check('correo','El correo no es válido').isEmail(),
    // check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']), 
    check('rol').custom( esRoleValido ), 
    validarCampos
] ,usuariosPost ); //El segundo argumento es el midleware, cuando los argumentos son 3

router.delete( '/:id', [
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] , usuariosDelete );


module.exports = router;