const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response, request } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario , Producto } = require('../models')

const cargarArchivo = async( req , res = response ) => {   

    try {

        //Imagenes
        const nombre = await subirArchivo( req.files, ['txt,md'] , 'textos' )

        res.json({ nombre });

    } catch (msg) {
        
        res.status(400).json({ msg });

    }

}

const actualizarImagen = async( req = request , res = response ) => {

    const { id , coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
        
            modelo = await Usuario.findById( id );

            if( !modelo ) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${ id }` });
            }

        break;
        case 'productos':
        
            modelo = await Producto.findById( id );

            if( !modelo ) {
                return res.status(400).json({ msg: `No existe un producto con el id ${ id }` });
            }

        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imagenes previas
    try {
        
        if( modelo.img ) {

            // Hay que borrar la imagen del servidor
            const pathImagen = path.resolve( __dirname , '../uploads' , coleccion , modelo.img );            
            
            if( fs.existsSync( pathImagen ) ) {                
                fs.unlinkSync( pathImagen );
            }

        }

    } catch (error) {
        
        return res.status(500).json({ msg: 'No se pudo eliminar la imagen' });

    }

    const nombre = await subirArchivo( req.files, undefined , coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);    

}

const actualizarImagenCloudinary = async( req = request , res = response ) => {

    const { id , coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
        
            modelo = await Usuario.findById( id );

            if( !modelo ) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${ id }` });
            }

        break;
        case 'productos':
        
            modelo = await Producto.findById( id );

            if( !modelo ) {
                return res.status(400).json({ msg: `No existe un producto con el id ${ id }` });
            }

        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imagenes previas
    try {
        
        if( modelo.img ) {

            const nombreARR = modelo.img.split('/');
            const nombre = nombreARR[ nombreARR.length -1 ];
            const [ public_id ] = nombre.split('.')

            await cloudinary.uploader.destroy( public_id );

        }

    } catch (error) {
        
        return res.status(500).json({ msg: 'No se pudo eliminar la imagen' });

    }

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);    

}

const mostrarImagen = async( req , res = response ) => {

    const { id , coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
        
            modelo = await Usuario.findById( id );

            if( !modelo ) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${ id }` });
            }

        break;
        case 'productos':
        
            modelo = await Producto.findById( id );

            if( !modelo ) {
                return res.status(400).json({ msg: `No existe un producto con el id ${ id }` });
            }

        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imagenes previas
    try {
        
        if( modelo.img ) {

            // Hay que borrar la imagen del servidor
            const pathImagen = path.resolve( __dirname , '../uploads' , coleccion , modelo.img );            
            
            if( fs.existsSync( pathImagen ) ) {                
                return res.sendFile( pathImagen )
            }

        }

    } catch (error) {
        
        return res.status(500).json({ msg: 'No se pudo eliminar la imagen' });

    } 

    const pathImgenNotFound = path.join( __dirname , '../assets/no-image.jpg');
    
    res.sendFile(pathImgenNotFound);

}

module.exports = {
    cargarArchivo
    ,actualizarImagen
    ,mostrarImagen
    ,actualizarImagenCloudinary
}