import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import * as socket from '../sockets/socket';



export default class Server {

    private static _intance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;


    private constructor() {
 
        this.app = express();

        //coneccion a base de datos
        // const MONGO_URI = 'mongodb://localhost/dblivereat';

        // mongoose.set('useFindAndModify',true);
        // mongoose.connect(MONGO_URI || process.env.MONGDB_URL, {
        //     useNewUrlParser:true,
        //     useCreateIndex:true
        // })
        // .then(DB => console.log('db is connected'));
        //-------------------------- 

 
        //coneccion a base de datos
         const MONGO_URI = 'mongodb+srv://teytech:Fail0412*@cluster0-hw8sk.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true';

         mongoose.set('useFindAndModify',true);
         mongoose.connect(MONGO_URI || process.env.MONGDB_URL, {
             useNewUrlParser:true,
             useCreateIndex:true
         })   
         .then(DB => console.log('db is connected'));
        //-------------------------- 

        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.escucharSockets();
    }

    public static get instance() {
        return this._intance || ( this._intance = new this() );
    }


    private escucharSockets() {

        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            // Conectar cliente
            socket.conectarCliente( cliente, this.io );

            // Desconectar
            socket.desconectar( cliente, this.io ); 

            // Configurar usuario
            socket.configurarUsuario( cliente, this.io );

            // pedidos
            socket.enviarCantiPedidos(cliente, this.io);

            //Validar si el usuario esta en linea
            socket.usuarioEnLinea(cliente,this.io);

            // Mensajes
            socket.mensaje( cliente, this.io );  
            
            //obtener negocios
            socket.obtenerNegocios(cliente, this.io);

            //marcar vistos
            socket.marcarVisto(cliente, this.io);

            socket.obtenerUsuarios(cliente,this.io);
            
            /*
            

            // configurar la imagen de perfil del usuario
            socket.configurarImgPerfil( cliente, this.io);

            // Obtener usuarios activos
            socket.obtenerUsuarios( cliente, this.io );

            //Validar si el usuario esta en linea
            socket.usuarioEnLinea(cliente,this.io);

            // Mensajes
            socket.mensaje( cliente, this.io );

               

            //notificaciones
            socket.notificacion( cliente, this.io);

            //modificarnombredelnegocio
            socket.configurarUsuarioConNegocio(cliente, this.io);
            
            //obtener negocios
            socket.obtenerNegocios(cliente, this.io);

            //marcar vistos
            socket.marcarVisto(cliente, this.io);
            */

        });

    }


    start( callback: Function ) {

        this.httpServer.listen( this.port, () => {} );

    }

}