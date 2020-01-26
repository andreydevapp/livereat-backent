import Server from "./classes/server";
import auth from "./routes/autenticacion";
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';



const server = Server.instance;

// BodyParser
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );

// CORS
server.app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}) 

// Rutas de servicios
server.app.use('/',auth);
server.app.use('/public/imgPlatillos',express.static(path.resolve('public/imgPlatillos')));
server.app.use('/public/imgPerfil',express.static(path.resolve('public/imgPerfil')));
server.app.use('/public/imgNegocios',express.static(path.resolve('public/imgNegocios')));



server.start( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});


