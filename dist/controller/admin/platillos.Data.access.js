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
const platillos_Model_1 = __importDefault(require("../../modelAdmin/platillos.Model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const upload_file_1 = require("../../services/upload-file");
const sharp_1 = __importDefault(require("sharp"));
const fs = require('fs');
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const environment_1 = require("../../global/environment");
aws_sdk_1.default.config.update({
    secretAccessKey: environment_1.amazonWs3.ws3SecretAccessKey,
    accessKeyId: environment_1.amazonWs3.ws3AccessKeyId,
    region: "us-west-1"
});
const s3 = new aws_sdk_1.default.S3();
function crearNuevoPlatillo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("Si entre a crear un platillo");
        //validar token para realizar el metodo
        const token = req.body.token;
        console.log(req.body);
        console.log("entre a crear platillo", token);
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                //img min
                sharp_1.default(req.file.path)
                    .resize(100, 100)
                    .toFile(__dirname + '/../../temp/images/tumb100/min' + req.file.filename, (err, info) => {
                    if (err) {
                        console.log("error", err);
                    }
                    else {
                        console.log("done");
                        console.log(info);
                        imgNormal(req, res);
                    }
                });
                function imgNormal(req, res) {
                    //img min
                    sharp_1.default(req.file.path)
                        .resize(2200, 2200)
                        .toFile(__dirname + '/../../temp/images/tumb600/' + req.file.filename, (err, info) => {
                        if (err) {
                            console.log("error", err);
                        }
                        else {
                            console.log("done");
                            console.log(info);
                            uploadImg(req, res);
                        }
                    });
                }
                function uploadImg(req, res) {
                    const fileContent = fs.readFileSync(__dirname + '/../../temp/images/tumb600/' + req.file.filename);
                    // Setting up S3 upload parameters
                    const params = {
                        Bucket: environment_1.amazonWs3.bucketImgPlatillosMin,
                        Key: req.file.filename,
                        Body: fileContent,
                        ACL: 'public-read'
                    };
                    // Uploading files to the bucket
                    s3.upload(params, function (err, data) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log("archivo subido");
                                uploadImgMin(req, res, data.Location);
                            }
                        });
                    });
                }
                function uploadImgMin(req, res, locationImg) {
                    const fileContent = fs.readFileSync(__dirname + '/../../temp/images/tumb100/min' + req.file.filename);
                    // Setting up S3 upload parameters
                    const params = {
                        Bucket: environment_1.amazonWs3.bucketImgPlatillosMin,
                        Key: "min_" + req.file.filename,
                        Body: fileContent,
                        ACL: 'public-read'
                    };
                    s3.upload(params, function (err, data) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log("archivo subido min");
                                savePlatillo(req, res, locationImg, data.Location);
                            }
                        });
                    });
                }
                function savePlatillo(req, res, locationImg, locationImgMin) {
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log('el token si coincde');
                        const payload = {
                            //informacion del platillo
                            nombre: req.body.nombre,
                            descripcion: req.body.descripcion,
                            precio: req.body.precio,
                            tipo: req.body.tipo,
                            estado: req.body.estado,
                            imagen: locationImg,
                            imagenMin: locationImgMin,
                            //información negocio
                            _idNegocio: req.body._idNegocio,
                        };
                        const newPlatillo = yield new platillos_Model_1.default(payload);
                        yield newPlatillo.save();
                        const platillos = yield platillos_Model_1.default.find({ _idNegocio: payload._idNegocio, tipo: payload.tipo });
                        const cantiPlatillos = yield platillos_Model_1.default.find({ _idNegocio: req.body.idNegocio }).count();
                        console.log(platillos);
                        res.json({ res: 'platillos', platillos, cantiPlatillos });
                    });
                }
            }
        }));
    });
}
exports.crearNuevoPlatillo = crearNuevoPlatillo;
function modificarPlatillo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                yield fs.unlink(path_1.default.resolve(req.file.path));
                res.json({ res: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                const payload = {
                    _id: req.body._id,
                    opc: req.body.opc,
                    data: req.body.data
                };
                if (payload.opc === "Nombre") {
                    yield platillos_Model_1.default.findOneAndUpdate({ _id: payload._id }, { nombre: payload.data });
                }
                else if (payload.opc === "Precio") {
                    yield platillos_Model_1.default.findOneAndUpdate({ _id: payload._id }, { precio: payload.data });
                }
                else if (payload.opc === "Descripcion") {
                    yield platillos_Model_1.default.findOneAndUpdate({ _id: payload._id }, { descripcion: payload.data });
                }
                const platillo = yield platillos_Model_1.default.findById({ _id: payload._id });
                res.json({ res: 'platillo', platillo });
            }
        }));
    });
}
exports.modificarPlatillo = modificarPlatillo;
function modificarConImagen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                const rutaImagen = req.body.imgPath;
                const payload = {
                    _id: req.body._id,
                    imgPath: req.body.imgPath,
                    imagen: req.file.path,
                    _idNegocio: req.body._idNegocio
                };
                console.log('platillo si entre', payload);
                yield platillos_Model_1.default.findOneAndUpdate({ _id: payload._id, _idNegocio: payload._idNegocio }, { imagen: payload.imagen });
                yield fs.unlink(path_1.default.resolve(rutaImagen.toString()));
                const platillo = yield platillos_Model_1.default.findById({ _id: payload._id });
                res.json({ res: 'platillo', platillo });
            }
        }));
    });
}
exports.modificarConImagen = modificarConImagen;
function eliminarPlatillo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
            }
            else {
                console.log("si entre a eliminar el platillo");
                const payload = {
                    idPlatillo: req.body.idPlatillo,
                    tipo: req.body.tipo,
                    idUsuario: req.body.idUsuario,
                    token: req.body.token,
                    encabezado: req.body.encabezado,
                    tipoFiltro: req.body.tipoFiltro,
                    rutaImagen: req.body.rutaImagen
                };
                const platillo = yield platillos_Model_1.default.findById({ _id: payload.idPlatillo });
                yield platillos_Model_1.default.findByIdAndDelete({ _id: payload.idPlatillo });
                upload_file_1.s3DestroyImagen(environment_1.amazonWs3.bucketImgPlatillos, platillo.imagen, (err) => {
                    console.log(err);
                    if (err) {
                        console.log("err");
                    }
                    obtenerLospLatillosConFiltros(req, res, payload);
                });
            }
        }));
    });
}
exports.eliminarPlatillo = eliminarPlatillo;
function modificarPlatilloEstadoAccesibilidad(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        console.log("si llegue");
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                yield fs.unlink(path_1.default.resolve(req.file.path));
                res.json({ res: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                console.log("si entre ");
                const payload = {
                    idUsuario: req.body._idNegocio,
                    _idPlatillo: req.body._idPlatillo,
                    query: req.body.query,
                    estadoActual: req.body.estadoActual,
                    encabezado: req.body.encabezado,
                    tipoFiltro: req.body.tipoFiltro,
                    tipo: req.body.tipo
                };
                console.log(payload);
                switch (payload.query) {
                    case "editarEstado":
                        console.log("ntre a editar estado");
                        if (payload.estadoActual === 0) {
                            yield platillos_Model_1.default.findOneAndUpdate({ _id: payload._idPlatillo, _idNegocio: payload.idUsuario }, { estado: 1 });
                        }
                        else {
                            yield platillos_Model_1.default.findOneAndUpdate({ _id: payload._idPlatillo, _idNegocio: payload.idUsuario }, { estado: 0 });
                        }
                        obtenerLospLatillosConFiltros(req, res, payload);
                        break;
                    case "editarAccesibilidad":
                        console.log("ntre a editar accesibilidad");
                        if (payload.estadoActual === 0) {
                            yield platillos_Model_1.default.findOneAndUpdate({ _id: payload._idPlatillo, _idNegocio: payload.idUsuario }, { accesibilidad: 1 });
                        }
                        else {
                            yield platillos_Model_1.default.findOneAndUpdate({ _id: payload._idPlatillo, _idNegocio: payload.idUsuario }, { accesibilidad: 0 });
                        }
                        obtenerLospLatillosConFiltros(req, res, payload);
                        break;
                    default:
                        break;
                }
            }
        }));
    });
}
exports.modificarPlatilloEstadoAccesibilidad = modificarPlatilloEstadoAccesibilidad;
function obtenerTodosLosPlatillos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const parametros = req.params.id;
        const opciones = parametros.split('separador');
        console.log(opciones);
        const token = opciones[2];
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
            }
            else {
                const payload = {
                    tipo: opciones[0],
                    idUsuario: opciones[1],
                    token: opciones[2],
                    encabezado: opciones[3],
                    tipoFiltro: opciones[4]
                };
                obtenerLospLatillosConFiltros(req, res, payload);
            }
        }));
    });
}
exports.obtenerTodosLosPlatillos = obtenerTodosLosPlatillos;
function obtenerLospLatillosConFiltros(req, res, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        if (payload.encabezado === "fecha") {
            //-1 mas recientes
            //1 mas antiguo            
            console.log("entre a obtener filtro por fecha");
            const platillos = yield platillos_Model_1.default.find({ _idNegocio: payload.idUsuario, tipo: payload.tipo }).sort({ createAt: payload.tipoFiltro });
            console.log(platillos);
            if (platillos.length > 0) {
                res.json({ res: 'platillos', platillos });
            }
            else {
                if (payload.tipo === 'Platillo') {
                    res.json({ res: 'Sin platillos' });
                }
                else {
                    res.json({ res: 'Sin bebidas' });
                }
            }
        }
        else if (payload.encabezado === "ventas") {
            console.log("wnre a ventas");
            const platillos = yield platillos_Model_1.default.find({ _idNegocio: payload.idUsuario, tipo: payload.tipo }).sort({ ventas: payload.tipoFiltro, createAt: -1 });
            console.log(platillos);
            if (platillos.length > 0) {
                res.json({ res: 'platillos', platillos });
            }
            else {
                if (payload.tipo === 'Platillo') {
                    res.json({ res: 'Sin platillos' });
                }
                else {
                    res.json({ res: 'Sin bebidas' });
                }
            }
        }
        else if (payload.encabezado === "estado") {
            console.log("entre a estados");
            const platillos = yield platillos_Model_1.default.find({ _idNegocio: payload.idUsuario, tipo: payload.tipo }).sort({ estado: payload.tipoFiltro, createAt: -1 });
            console.log(platillos);
            if (platillos.length > 0) {
                res.json({ res: 'platillos', platillos });
            }
            else {
                if (payload.tipo === 'Platillo') {
                    res.json({ res: 'Sin platillos' });
                }
                else {
                    res.json({ res: 'Sin bebidas' });
                }
            }
        }
        else if (payload.encabezado === "accesibilidad") {
            console.log("enre a accesibilidad");
            const platillos = yield platillos_Model_1.default.find({ _idNegocio: payload.idUsuario, tipo: payload.tipo }).sort({ accesibilidad: payload.tipoFiltro, createAt: -1 });
            console.log(platillos);
            if (platillos.length > 0) {
                res.json({ res: 'platillos', platillos });
            }
            else {
                if (payload.tipo === 'Platillo') {
                    res.json({ res: 'Sin platillos' });
                }
                else {
                    res.json({ res: 'Sin bebidas' });
                }
            }
        }
    });
}
function obtenerUnPlatillo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
            }
            else {
                const platillo = yield platillos_Model_1.default.findById({ _id: req.body.idPlatillo });
                res.json({ res: 'platillo', platillo });
            }
        }));
    });
}
exports.obtenerUnPlatillo = obtenerUnPlatillo;
function cantiPlatillos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        console.log("entre a canti");
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                const platillos = yield platillos_Model_1.default.find({ _idNegocio: req.body.idNegocio }).count();
                console.log(platillos);
                res.json({ res: 'platillos', platillos });
            }
        }));
    });
}
exports.cantiPlatillos = cantiPlatillos;
