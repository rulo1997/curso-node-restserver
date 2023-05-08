
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { obtenerProductos
        ,obtenerProducto
        ,crearProducto
        ,actualizarProducto
        ,borrarProducto } = require('../controllers/productos');
const { existeProductoId, existeCategoria } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerProductos );

//Obtener una categoria por id - publico
router.get('/:id', [
    validarJWT
    ,check('id','No es un ID válido').isMongoId()
    ,check('id').custom( existeProductoId )
    ,validarCampos 
] ,obtenerProducto );

//Crear una nueva cateegoria - privado - cualquier persona con token válido
router.post('/', [ 
    validarJWT 
    ,check('nombre','El nombre es obligatorio').not().isEmpty()
    ,check('categoria','La categoria es obligatorio').not().isEmpty()
    ,check('categoria').custom( existeCategoria )
    ,validarCampos 
] , crearProducto );

//Actualizar un registro por id - privado - cualquier persona con token válido
router.put('/:id', [
    validarJWT
    ,check('id','No es un ID válido').isMongoId()
    ,check('id').custom( existeProductoId ) 
    ,validarCampos 
] , actualizarProducto );

//Actualizar un registro por id - privado - admin
router.delete('/:id', [
    validarJWT
    ,esAdminRole
    ,check('id','No es un ID válido').isMongoId()
    ,check('id').custom( existeProductoId )
    ,validarCampos 
] , borrarProducto );


module.exports = router;