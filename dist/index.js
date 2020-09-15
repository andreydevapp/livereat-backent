"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const cors_1 = __importDefault(require("cors"));
//clientes
const autenticacion_1 = __importDefault(require("./routes/client/autenticacion"));
const negocios_1 = __importDefault(require("./routes/client/negocios"));
const platilllos_1 = __importDefault(require("./routes/client/platilllos"));
const pedidos_1 = __importDefault(require("./routes/client/pedidos"));
//negocios
const autenticacion_2 = __importDefault(require("./routes/admin/autenticacion"));
const platillos_1 = __importDefault(require("./routes/admin/platillos"));
const pedidos_2 = __importDefault(require("./routes/admin/pedidos"));
const planes_1 = __importDefault(require("./routes/admin/planes"));
const cantidades_1 = __importDefault(require("./routes/admin/cantidades"));
//global
const chat_1 = __importDefault(require("./routes/global/chat"));
//enviroments
const body_parser_1 = __importDefault(require("body-parser"));
const server = server_1.default.instance;
// BodyParser
server.app.use(cors_1.default());
server.app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
// Rutas de servicios para el cliente
server.app.use('/', autenticacion_1.default);
server.app.use('/', negocios_1.default);
server.app.use('/', platilllos_1.default);
server.app.use('/', pedidos_1.default);
// Rutas de servicios para el negocio
server.app.use('/', autenticacion_2.default);
server.app.use('/', platillos_1.default);
server.app.use('/', pedidos_2.default);
server.app.use('/', planes_1.default);
server.app.use('/', cantidades_1.default);
//Rutas globales
server.app.use('/', chat_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
