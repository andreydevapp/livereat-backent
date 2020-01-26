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
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
function crearNuevoUsuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log(req.body.correo);
        console.log(req.body.nombre);
        console.log(req.body);
        //verificamos si el correo esta disponible
        const user = yield userModel_1.default.findOne({ email: req.body.correo });
        console.log(user !== null);
        if (!user) {
            //no existe un usuario con este correo por lo que lo guardo
            console.log('no existe un usuario con este user');
            const payloadToken = {
                nombre: req.body.nombre,
                cedula: req.body.cedula
            };
            const token = yield jsonwebtoken_1.default.sign((payloadToken), 'my_secret_token_Key');
            const payload = {
                nombre: req.body.nombre,
                cedula: req.body.cedula,
                email: req.body.correo,
                password: req.body.password,
                imagen: req.file.path,
                tempToken: token
            };
            const user = new userModel_1.default(payload);
            yield user.save();
            res.json({ res: 'usuario registrado', token, id: user._id, nombre: user.nombre, imgUrl: req.file.path, id_negocio: user.id_negocio, email: user.email });
        }
        else {
            // ya existe un usuario con este correo
            res.json({ res: 'La dirección de este correo eléctronico ya esta en uso' });
        }
    });
}
exports.crearNuevoUsuario = crearNuevoUsuario;
function loguearse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const user = yield userModel_1.default.findOne({ email: req.body.correo });
        console.log(user);
        if (user === null) {
            //no existe un usuario con este correo por lo que lo puedo guardar
            res.json({ res: 'correo invalido' });
        }
        else {
            //ya existe un usuario con este correo
            console.log(req.body.password);
            console.log(user.password);
            bcrypt_nodejs_1.default.compare(req.body.pass, user.password, function (err, sonIguales) {
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
                            yield userModel_1.default.findByIdAndUpdate(user._id, { tempToken: token });
                            res.json({ res: 'usuario registrado', token, id: user._id, nombre: user.nombre, imgUrl: user.imagen, email: user.email });
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
        console.log(req.body.token);
        const user = yield userModel_1.default.findOne({ tempToken: req.body.token });
        console.log(user);
        if (user === null) {
            //no existe un usuario con este token
            res.json({ res: 'token invalido' });
        }
        else {
            //ya existe un usuario con este token
            const payloadToken = {
                nombre: user.nombre,
                cedula: user.cedula
            };
            const token = yield jsonwebtoken_1.default.sign((payloadToken), 'my_secret_token_Key');
            yield userModel_1.default.findByIdAndUpdate(user._id, { tempToken: token });
            res.json({ res: 'usuario registrado', token, id: user._id, nombre: user.nombre, imgUrl: user.imagen, email: user.email });
        }
    });
}
exports.loguearsePorToken = loguearsePorToken;
