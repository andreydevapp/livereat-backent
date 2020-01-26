"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const autenticacion_1 = __importDefault(require("./routes/autenticacion"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const server = server_1.default.instance;
// BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
// Rutas de servicios
server.app.use('/', autenticacion_1.default);
server.app.use('/public/imgPlatillos', express_1.default.static(path_1.default.resolve('public/imgPlatillos')));
server.app.use('/public/imgPerfil', express_1.default.static(path_1.default.resolve('public/imgPerfil')));
server.app.use('/public/imgNegocios', express_1.default.static(path_1.default.resolve('public/imgNegocios')));
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
