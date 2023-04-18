const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {

    return new Promise( ( resolve , reject ) => {

        const payload = { uid }; //Lo que se va a grabar en el JWT

        jwt.sign( payload , process.env.SECRETORPRIVATEKEY , {
            expiresIn: '4h'
        } , (err , token) => {

            if( err ) {
                console.log(err)
                reject('No se pudo generar el token');
            }
            else {
                resolve( token )
            }

        });

    });

}

module.exports = {
    generarJWT
}