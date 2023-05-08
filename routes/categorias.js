
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias );

//Obtener una categoria por id - publico
router.get('/:id', [
    validarJWT
    ,check('id','No es un ID válido').isMongoId()
    ,check('id').custom( existeCategoriaId )
    ,validarCampos 
] ,obtenerCategoria );

//Crear una nueva cateegoria - privado - cualquier persona con token válido
router.post('/', [ 
    validarJWT 
    ,check('nombre','El nombre es obligatorio').not().isEmpty()
    ,validarCampos 
] , crearCategoria);

//Actualizar un registro por id - privado - cualquier persona con token válido
router.put('/:id', [
    validarJWT
    ,check('nombre','El nombre es obligatorio').not().isEmpty()
    ,check('id','No es un ID válido').isMongoId()
    ,check('id').custom( existeCategoriaId )
    ,validarCampos 

] , actualizarCategoria );

//Actualizar un registro por id - privado - admin
router.delete('/:id', [
    validarJWT
    ,esAdminRole
    ,check('id','No es un ID válido').isMongoId()
    ,check('id').custom( existeCategoriaId )
    ,validarCampos 
] , borrarCategoria );


module.exports = router;