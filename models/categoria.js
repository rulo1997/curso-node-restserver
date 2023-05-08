const { Schema , model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String
        ,required: [true,'El nombre es obligatorio']
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
});

CategoriaSchema.methods.toJSON = function() { //Usamos una funcion normal para usar el this
    const { __v , _id , ...categoria } = this.toObject();
    categoria.id = _id;
    return categoria;
}

module.exports = model( 'Categoria' , CategoriaSchema );

