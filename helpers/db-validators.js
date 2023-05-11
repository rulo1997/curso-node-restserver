const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne({ rol });

    if( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`); //Asi funciona el express validator
    }

}

const emailExiste =  async( correo ) => {

    const existeEmail = await Usuario.findOne({ correo });     

    if( existeEmail ) {        
        throw new Error(`El correo ${ correo } ya está registrado`);
    }

}  

const existeUsuarioPorId =  async( id ) => {

    const existeUsuario = await Usuario.findById(id);     

    if( !existeUsuario ) {        
        throw new Error(`El id no existe ${ id }`);
    }

} 

const existeCategoria = async( categoria ) => {
     
    const existeCategoria = await Categoria.findOne({ nombre: categoria });    

    if( !existeCategoria ) {
        throw new Error(`La categoria ${ categoria } no existe`);
    }

}

const existeProductoId = async( id ) => {

    const existeId = await Producto.findById( id );

    if( !existeId ) {
        throw new Error(`El id ${ id } no existe`);
    }

}

const coleccionesPermitidas = ( coleccion = '' ,colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );

    if( !incluida ) {
        throw new Error(`La coleccion ${ coleccion } no es permitida , ${ colecciones }`);
    }

    return true;

}

module.exports = {
    esRoleValido
    ,emailExiste
    ,existeUsuarioPorId
    ,existeCategoria
    ,existeProductoId
    ,coleccionesPermitidas
}