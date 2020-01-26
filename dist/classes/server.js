"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_1 = require("../global/environment");
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket = __importStar(require("../sockets/socket"));
class Server {
    constructor() {
        this.app = express_1.default();
        //coneccion a base de datos
        const MONGO_URI = 'mongodb+srv://teytech:Fail0412*@cluster0-hw8sk.mongodb.net/test?retryWrites=true&w=majority';
        mongoose_1.default.set('useFindAndModify', true);
        mongoose_1.default.connect(MONGO_URI || process.env.MONGDB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
            .then(DB => console.log('db is connected'));
        //-------------------------- 
        this.port = environment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.escucharSockets();
    }
    static get instance() {
        return this._intance || (this._intance = new this());
    }
    escucharSockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', cliente => {
            // Conectar cliente
            socket.conectarCliente(cliente, this.io);
            // Desconectar
            socket.desconectar(cliente, this.io);
            // Configurar usuario
            socket.configurarUsuario(cliente, this.io);
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
    start(callback) {
        this.httpServer.listen(this.port, () => { });
    }
}
exports.default = Server;
