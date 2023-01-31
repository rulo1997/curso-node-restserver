const express = require('express');
const cors = require('cors');


class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares -> funcion que siempre se ejecuta cuando levantemos el servidor
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();

    }

    middlewares() {

        //CORS
        this.app.use(cors())

        //Parseo y lectura del body
        this.app.use( express.json() ); //Cualquier informacion que venga por los metodos la va a serializar en formato JSON

        //Directorio publico
        this.app.use( express.static('public') );

    }

    routes() {

        this.app.use( this.usuariosPath , require('../routes/usuarios') );

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${ this.port }`);
        });   

    }

}

module.exports = Server;