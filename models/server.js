
const express = require('express');
const cors = require('cors');
const dbConnection = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth'
            ,usuarios: '/api/usuarios'
            ,categorias: '/api/categorias' 
            ,productos: '/api/productos' 
            ,buscar: '/api/buscar'
        };                

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares --> otra función que se ejecuta cuando se levanta el servidor
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {

        await dbConnection();

    }

    middlewares() {

        //CORS --> protección desde donde viene la petición hacia el backend
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );

    }

    routes() {

        this.app.use( this.paths.auth , require('../routes/auth') );

        this.app.use( this.paths.usuarios , require('../routes/user') );

        this.app.use( this.paths.categorias , require('../routes/categorias') );

        this.app.use( this.paths.productos , require('../routes/productos') );

        this.app.use( this.paths.buscar , require('../routes/buscar') );

    }

    listen() {
        this.app.listen( this.port , () => {
            console.log('Servidor corriendo en el puerto' , this.port);
        });
    }

}

module.exports = Server