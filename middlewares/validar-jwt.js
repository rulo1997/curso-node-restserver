const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async( req = request, res = response , next ) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }    

    try {
     
        const { uid } = jwt.verify( token , process.env.SECRETORPRIVATEKEY );     //Esto larga un throw new error si falla, por eso utilizamos el catch   
        
        //Leer el usuario correspondiente al uid
        const usuario = await Usuario.findById( uid );

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Usuario no existe en base de datos'
            })
        }

        //Verificar si el uid tiene el estado en true
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado en false'
            })
        }

        req.usuario = usuario;

        req.uid = uid;

        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }    

}

module.exports = {
    validarJWT
}