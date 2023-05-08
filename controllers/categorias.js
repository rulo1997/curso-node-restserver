const { response } = require("express")

const { Categoria } = require('../models')

// obtenerCategorias - paginado - total - populate

const obtenerCategorias = async( req , res = response ) => {    

    const { limite , desde = 0 } = req.query;

    const [ total , categorias ] = await Promise.all([
        Categoria.countDocuments()
        ,Categoria.find({ estado: true })
            .populate('usuario','nombre')
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total
        ,categorias
    });

}

// obtenerCategoria - populate

const obtenerCategoria = async( req , res = response ) => {

    const { id } = req.params;    

    const categoria = await Categoria.findById( id );

    res.json(categoria);

}


const crearCategoria = async(req , res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre
        ,usuario: req.usuario._id
    }

    const categoria = await new Categoria( data ); //Esto lo prepara para guardar

    await categoria.save(); //Ahora si se graba en la base de datos

    res.status(201).json( categoria );

}

// actualizarCategoria

const actualizarCategoria = async( req , res = response ) => {

    const { id } = req.params;

    const { estado , usuario , ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id , data , { new: true } ); //El new en true manda el nuevo documento actualizado

    res.json( categoria );

}

const borrarCategoria = async( req , res = response ) => {

    const { id } = req.params;    

    const categoria = await Categoria.findByIdAndUpdate( id , { estado: false } , { new: true });

    res.json({
        msg: 'Eliminación correctamente'
        ,categoria
    });

} 

// borrarCategoria - estado:false


module.exports = {
    obtenerCategorias
    ,obtenerCategoria
    ,crearCategoria
    ,actualizarCategoria
    ,borrarCategoria
}