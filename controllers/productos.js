const { response } = require("express")

const { Producto, Categoria } = require('../models')

// obtenerCategorias - paginado - total - populate

const obtenerProductos = async( req , res = response ) => {    

    const { limite , desde = 0 } = req.query;

    const [ total , productos ] = await Promise.all([
        Producto.countDocuments({ estado: true })
        ,Producto.find({ estado: true })
            .populate('usuario','nombre')
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total
        ,productos
    });

}

// obtenerCategoria - populate

const obtenerProducto = async( req , res = response ) => {

    const { id } = req.params;    

    const producto = await Producto.findById( id )
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');

    res.json(producto);

}


const crearProducto = async(req , res = response) => {

    const { nombre , categoria: categoriaNombre , ...resto } = req.body;

    console.log({ nombre });

    const nombreProducto = nombre.toUpperCase();

    console.log({ nombreProducto });

    const productoDB = await Producto.findOne({ nombre: nombreProducto });    

    const { id: categoria } = await Categoria.findOne({ nombre: categoriaNombre });

    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe`
        })
    }

    //Generar la data a guardar 
    const data = {
        nombre : nombreProducto
        ,usuario: req.usuario._id
        ,categoria        
    }

    console.log({ data });

    const producto = await new Producto( data ); //Esto lo prepara para guardar

    await producto.save(); //Ahora si se graba en la base de datos

    res.status(200).json( producto );

}

// actualizarCategoria

const actualizarProducto = async( req , res = response ) => {

    const { id } = req.params;

    const { estado , usuario , ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const existeProducto = await Producto.findOne({ nombre : data.nombre });

    if( existeProducto ) {
        res.status(400).json({ 
            msg: `Ya existe un producto con el nombre ${ data.nombre }`
        });
    }

    const producto = await Producto.findByIdAndUpdate( id , data , { new: true } ); //El new en true manda el nuevo documento actualizado

    res.json( producto );

}

const borrarProducto = async( req , res = response ) => {

    const { id } = req.params;    

    const producto = await Producto.findByIdAndUpdate( id , { estado: false } , { new: true });

    res.json({
        msg: 'Eliminación correctamente'
        ,producto
    });

} 

// borrarCategoria - estado:false


module.exports = {
    obtenerProductos
    ,obtenerProducto
    ,crearProducto
    ,actualizarProducto
    ,borrarProducto
}