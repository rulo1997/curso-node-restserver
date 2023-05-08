const { Schema , model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String
        ,required: [true,'El nombre es obligatorio']
        ,unique: true
    }
    ,estado: {
        type: Boolean
        ,default: true
        ,required: true
    }
    ,usuario: {
        type: Schema.Types.ObjectId //Es el tipo de como tiene que venir de otra coleccion
        ,ref: 'Usuario' //La referencia al otro schema que se armó
        ,required: true
    }
    ,precio: {
        type: Number
        ,default: 0
    }
    ,categoria : {
        type: Schema.Types.ObjectId
        ,ref: 'Categoria'
        ,required: true
    }
    ,descripcion : {
        type: String
    }
    ,disponible : {
        type: Boolean
        ,default: true
    }
});

ProductoSchema.methods.toJSON = function() { //Usamos una funcion normal para usar el this
    const { __v , estado , ...producto } = this.toObject();    
    return producto;
}

module.exports = model( 'Producto' , ProductoSchema );

