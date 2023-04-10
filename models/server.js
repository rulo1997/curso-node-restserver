
const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios';

        //Middlewares --> otra función que se ejecuta cuando se levanta el servidor
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
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

        this.app.use( this.usuariosPath , require('../routes/user') );

    }

    listen() {
        this.app.listen( this.port , () => {
            console.log('Servidor corriendo en el puerto' , this.port);
        })
    }

}

module.exports = Server