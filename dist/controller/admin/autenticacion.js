"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const negocio_Model_1 = __importDefault(require("../../modelAdmin/negocio.Model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
function crearNuevoNegocio(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        const negocio = yield negocio_Model_1.default.findOne({ email: req.body.email });
        if (!negocio) {
            const payload = {
                //usuario
                nombreUsuario: req.body.nombreUsuario,
                fechaNacimiento: req.body.fechaNacimiento,
                cedula: req.body.cedula,
                email: req.body.email,
                password: req.body.password,
                tokenTem: 'sin-token',
                //negocio
                nombreNegocio: req.body.nombreNegocio,
                imagen: req.file.path,
                location: {
                    type: "Point",
                    coordinates: [parseFloat(req.body.lon), parseFloat(req.body.lat)]
                }
            };
            const payloadToken = {
                nombreUsuario: req.body.nombreUsuario,
                cedula: req.body.cedula,
                nombreNegocio: req.body.nombreNegocio
            };
            const token = yield jsonwebtoken_1.default.sign((payloadToken), 'my_secret_token_Key');
            payload.tokenTem = token;
            const newNegocio = new negocio_Model_1.default(payload);
            yield newNegocio.save();
            res.json({
                res: 'negocio registrado',
                //usuario
                _id: newNegocio._id,
                nombreUsuario: newNegocio.nombreUsuario,
                fechaNacimiento: newNegocio.fechaNacimiento,
                cedula: newNegocio.cedula,
                email: newNegocio.email,
                password: newNegocio.password,
                tokenTem: newNegocio.tokenTem,
                //negocio
                nombreNegocio: newNegocio.nombreNegocio,
                imagen: newNegocio.imagen,
                location: newNegocio.location
            });
        }
        else {
            res.json({ res: 'ya existe un usuario con este correo' });
        }
    });
}
exports.crearNuevoNegocio = crearNuevoNegocio;
function loguearse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const negocio = yield negocio_Model_1.default.findOne({ email: req.body.correo });
        console.log(negocio);
        if (negocio === null) {
            //no existe un usuario con este correo por lo que lo puedo guardar
            res.json({ res: 'correo invalido' });
        }
        else {
            //ya existe un usuario con este correo
            console.log(req.body.password);
            console.log(negocio.password);
            bcrypt_nodejs_1.default.compare(req.body.pass, negocio.password, function (err, sonIguales) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(sonIguales);
                    if (err) {
                        console.log("err");
                        console.log(err);
                        res.json({ res: err });
                    }
                    else {
                        if (sonIguales) {
                            const payloadToken = {
                                nombre: req.body.nombre,
                                cedula: req.body.cedula
                            };
                            const token = yield jsonwebtoken_1.default.sign((payloadToken), 'my_secret_token_Key');
                            yield negocio_Model_1.default.findByIdAndUpdate(negocio._id, { tokenTem: token });
                            res.json({
                                res: 'negocio registrado',
                                //usuario
                                _id: negocio._id,
                                nombreUsuario: negocio.nombreUsuario,
                                fechaNacimiento: negocio.fechaNacimiento,
                                cedula: negocio.cedula,
                                email: negocio.email,
                                password: negocio.password,
                                tokenTem: token,
                                //negocio
                                nombreNegocio: negocio.nombreNegocio,
                                imagen: negocio.imagen,
                                location: negocio.location
                            });
                        }
                        else {
                            res.json({ res: 'pass invalida' });
                        }
                    }
                });
            });
        }
    });
}
exports.loguearse = loguearse;
function loguearsePorToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //buscamos el token
        console.log('busco el token en la db');
        console.log(req.body.token);
        const negocio = yield negocio_Model_1.default.findOne({ tokenTem: req.body.token });
        console.log(negocio);
        if (negocio === null) {
            //no existe un usuario con este token
            res.json({ res: 'token invalido' });
        }
        else {
            //ya existe un usuario con este token
            const payloadToken = {
                nombreUsuario: negocio.nombreUsuario,
                cedula: negocio.cedula,
                nombreNegocio: negocio.nombreNegocio
            };
            const token = yield jsonwebtoken_1.default.sign((payloadToken), 'my_secret_token_Key');
            yield negocio_Model_1.default.findByIdAndUpdate(negocio._id, { tokenTem: token });
            res.json({
                res: 'negocio registrado',
                //usuario
                _id: negocio._id,
                nombreUsuario: negocio.nombreUsuario,
                fechaNacimiento: negocio.fechaNacimiento,
                cedula: negocio.cedula,
                email: negocio.email,
                password: negocio.password,
                tokenTem: token,
                //negocio
                nombreNegocio: negocio.nombreNegocio,
                imagen: negocio.imagen,
                location: negocio.location
            });
        }
    });
}
exports.loguearsePorToken = loguearsePorToken;
