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
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const environment_1 = require("../../global/environment");
const request_1 = __importDefault(require("request"));
aws_sdk_1.default.config.update({
    secretAccessKey: environment_1.amazonWs3.ws3SecretAccessKey,
    accessKeyId: environment_1.amazonWs3.ws3AccessKeyId,
    region: "us-west-1"
});
const s3 = new aws_sdk_1.default.S3();
let mailUser = '';
let nomUser = '';
let nomNegocio = '';
function crearUsuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log(req.body);
        const negocio = yield negocio_Model_1.default.findOne({ email: req.body.email });
        if (!negocio) {
            console.log(req.file.path);
            sharp_1.default(req.file.path)
                .resize(300, 300)
                .toFile(__dirname + '/../../temp/images/tumb300/min' + req.file.filename, (err, info) => {
                if (err) {
                    console.log("error", err);
                }
                else {
                    console.log("done");
                    console.log(info);
                    uploadImg(req, res);
                }
            });
            function uploadImg(req, res) {
                const fileContent = fs_1.default.readFileSync(req.file.path);
                // Setting up S3 upload parameters
                const params = {
                    Bucket: environment_1.amazonWs3.bucketImgNegocios,
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
                const fileContent = fs_1.default.readFileSync(__dirname + '/../../temp/images/tumb300/min' + req.file.filename);
                // Setting up S3 upload parameters
                const params = {
                    Bucket: environment_1.amazonWs3.bucketImgNegociosMin,
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
                            saveNegocio(req, res, locationImg, data.Location);
                        }
                    });
                });
            }
            function saveNegocio(req, res, locationImg, locationImgMin) {
                return __awaiter(this, void 0, void 0, function* () {
                    const payloadToken = {
                        email: req.body.email,
                        nombreNegocio: req.body.nombreNegocio
                    };
                    const token = yield jsonwebtoken_1.default.sign((payloadToken), 'my_secret_token_Key');
                    const payload = {
                        //usuario
                        email: req.body.email,
                        password: req.body.password,
                        tokenTem: token,
                        //negocio
                        nombreNegocio: req.body.nombreNegocio,
                        imagen: locationImg,
                        imagenMin: locationImgMin,
                        location: {
                            type: "Point",
                            coordinates: [0, 0]
                        }
                    };
                    const newNegocio = new negocio_Model_1.default(payload);
                    yield newNegocio.save();
                    res.json({
                        res: 'negocio registrado',
                        //usuario
                        _id: newNegocio._id,
                        nombreUsuario: newNegocio.nombreUsuario,
                        cedula: newNegocio.cedula,
                        email: newNegocio.email,
                        password: newNegocio.password,
                        tokenTem: newNegocio.tokenTem,
                        //negocio
                        nombreNegocio: newNegocio.nombreNegocio,
                        telefonoNegocio: newNegocio.telefonoNegocio,
                        direccion: newNegocio.direccion,
                        envio: newNegocio.envio,
                        imagen: newNegocio.imagen,
                        imagenMin: newNegocio.imagenMin,
                        location: newNegocio.location,
                        tipoPlan: newNegocio.tipoPlan,
                        active: newNegocio.active
                    });
                });
            }
        }
        else {
            res.json({ res: 'ya existe un usuario con este correo' });
        }
    });
}
exports.crearUsuario = crearUsuario;
function activarCuenta(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        console.log(req.body);
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                activateAccount();
            }
        }));
        function activateAccount() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("provincia", parseInt(req.body.idProvincia));
                console.log("canton", req.body.idCanton);
                console.log("distrito", req.body.idDistrito);
                console.log("cedula", req.body.codigoCedula);
                let cantonInt = parseInt(req.body.idCanton);
                let distritoInt = parseInt(req.body.idDistrito);
                let canton = "";
                let distrito = "";
                if (parseInt(req.body.idCanton) < 10) {
                    canton = "0" + cantonInt;
                }
                if (parseInt(req.body.idDistrito) < 10) {
                    distrito = "0" + distritoInt;
                }
                const user = yield negocio_Model_1.default.findById(req.body.idUser);
                console.log(user);
                const payloadFirm = {
                    "id": req.body.cedula.toString(),
                    "nombre": req.body.nombreUsuario.toString(),
                    "email": user.email,
                    "tele": req.body.telefonoNegocio.toString(),
                    "provincia": req.body.idProvincia.toString(),
                    "canton": canton.toString(),
                    "distrito": distrito.toString()
                };
                request_1.default.post('http://104.248.58.128:7777/generar', { json: payloadFirm }, (error, resDes, bodyRes) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    console.log("llave", bodyRes);
                    yield negocio_Model_1.default.findByIdAndUpdate(req.body.idUser, {
                        nombreUsuario: req.body.nombreUsuario,
                        cedula: req.body.cedula,
                        "location.coordinates": [req.body.lon, req.body.lat],
                        telefonoNegocio: req.body.telefonoNegocio,
                        direccion: req.body.direccion,
                        envio: req.body.envio,
                        active: true,
                        codigoCedula: req.body.codigoCedula,
                        provincia: parseInt(req.body.idProvincia),
                        canton,
                        distrito,
                        publicKey: bodyRes.LLave_Publica,
                        pinKey: bodyRes.PIN,
                        passwd: bodyRes.passwd,
                        privateKey: bodyRes.LLave_Privada
                    });
                    const newNegocio = yield negocio_Model_1.default.findById(req.body.idUser);
                    res.json({
                        res: 'negocio registrado',
                        //usuario
                        _id: newNegocio._id,
                        nombreUsuario: newNegocio.nombreUsuario,
                        cedula: newNegocio.cedula,
                        email: newNegocio.email,
                        password: newNegocio.password,
                        tokenTem: newNegocio.tokenTem,
                        //negocio
                        nombreNegocio: newNegocio.nombreNegocio,
                        telefonoNegocio: newNegocio.telefonoNegocio,
                        direccion: newNegocio.direccion,
                        envio: newNegocio.envio,
                        imagen: newNegocio.imagen,
                        imagenMin: newNegocio.imagenMin,
                        location: newNegocio.location,
                        tipoPlan: newNegocio.tipoPlan,
                        active: newNegocio.active
                    });
                    mailUser = newNegocio.email;
                    nomUser = newNegocio.nombreUsuario;
                    nomNegocio = newNegocio.nombreNegocio;
                    sendEmail();
                }));
            });
        }
    });
}
exports.activarCuenta = activarCuenta;
function sendEmail() {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: 'aocastillo@est.utn.ac.cr',
                pass: 'Fail0412*'
            }
        });
        const html = `<div style="width: 85%; text-align: center; margin: auto;">
    <img style="width:220px; height:90px; margin: auto;"  src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/logo.PNG" alt="">
    <br><br>
    <span style="font-size: 18px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #44d1ea;">
        ¿Estás listo para hacer crecer <strong>${nomNegocio}</strong> con Livereat?
    </span>
    <span>
        <img width="15px" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/rocket.png" alt="">
    </span>
    <div style="padding-top: 10px;"></div>
    <p style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
        Con Livereat manejas de forma sencilla la información de tu empresa. Dedica unas horas a la semana al manejo de tus datos y verás crecer tu negocio.
    </p>
    <p style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #44d1ea;">
        Con Livereat puedes:
    </p>

    <div style="text-align: left;">
        <li style="color: #44d1ea;">
            <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Llevar en orden tu <strong>inventario.</strong>
            </span>
        </li>
        <li style="color: #44d1ea;">
            <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Crear, enviar e imprimir <strong>facturas.</strong>
            </span>
        </li>
        <li style="color: #44d1ea;">
            <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Enviar <strong>notificaciones</strong> a tus clientes sobre el estado de sus facturas.
            </span>
        </li>
        <li style="color: #44d1ea;">
            <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Crear otros <strong>usuarios</strong> para que ingresen a Livereat con permisos restringidos.
            </span>
        </li>
        <li style="color: #44d1ea;">
            <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Tener <strong>reportes</strong> detallados de todas los pedidos.
            </span>
        </li>
        <li style="color: #44d1ea;">
            <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Manejar listas de <strong>precios de tus platillos y envios.</strong> 
            </span>
        </li>
    </div>

    <br>

    <span style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
        Para ver nuestros planes, haz click aquí.
    </span>
    <br>
    <br>
    <button style="font-style: none; padding-top: 10px; padding-bottom: 10px; padding-left: 25px; padding-right: 25px; background-color: #44d1ea; color: white; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; border: none; border-radius: 10px;">
        app.livereat.com
    </button>
    <br>
    <br>
    <br>
    <div style="height: 1px; background-color: #d4d4d4;"></div>
    <br>
    <br>
    <br>
    <br>
    <span>
        <img style="width:17px" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/lifebuoy.png" alt=""> 
    </span>
    <span style="font-size: 20px; color: #44d1ea; font-weight: 400; font-family:  sans-serif; line-height: 30px;">
         Centro de <strong>Ayuda</strong> 
    </span>
    <br><br>
    <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
        Consulta <a style="font-style: none; font-size: 14px; color: #44d1ea; font-weight: 400; font-family:  sans-serif; line-height: 20px;" href="#">aquí</a> la documentación y aprende paso a paso a usar todas las funcionalidades de la aplicación.
    </span><br><br>
    <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
        Si tienes dudas puedes escribirnos en <a style="font-style: none; font-size: 14px; color: #44d1ea; font-weight: 400; font-family:  sans-serif; line-height: 20px;" href="#">livereat.com/123</a> 
    </span>
    <br><br><br>
    <span style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
        Con Livereat Ganas Tiempo y Tranquilidad
    </span>
    <br>
    <br>
    <div  style="width: 100%; ">
        <div style="display: inline-block; margin: auto;">
             <img style="width: 100px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/app_store.png" alt="">
        </div>
        <div style="display: inline-block;">
             <img style="width: 100px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/google_play.png" alt="">
        </div>
    </div>
    <br>
    <div  style="width: 100%; ">
        <div style="display: inline-block; margin: auto; padding-right: 15px;">
            <a style="font-style: none;" href="https://twitter.com/">
                <img style="width: 30px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/twitter.png" alt="">
            </a>
        </div>
        <div style="display: inline-block; padding-right: 15px;">
            <a style="font-style: none;" href="https://www.facebook.com/">
                <img style="width: 30px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/facebook.png" alt="">
            </a>
        </div>
        <div style="display: inline-block; margin: auto; padding-right: 15px;">
            <a style="font-style: none;" href="https://www.instagram.com/">
                <img style="width: 30px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/instagram.png" alt="">
            </a>
       </div>
       <div style="display: inline-block;">
            <a style="font-style: none;" href="https://www.youtube.com/">
                <img style="width: 35px; height: 35px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/youtube.png" alt="">
            </a>
       </div>
    </div>
    <br>
    <span style="text-align: left !important; font-size: 12px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
        © Livereat - Todos los derechos reservados
    </span><br>
    <span>
        <img style="width: 11px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/costa-rica.png" alt="">
    </span>
    <span style="text-align: left !important; font-size: 12px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
        Hecho con <span> <img style="width: 11px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/heart.png" alt=""></span> en Costa Rica
    </span>
</div>`;
        console.log(mailUser);
        console.log(nomUser);
        transporter.sendMail({
            from: 'Livereat <aocastillo@est.utn.ac.cr>',
            to: mailUser,
            subject: `Bienvenido a Livereat ${nomUser}`,
            text: "",
            html,
        }, (err, info) => {
            if (err) {
                console.log("hubo un error", err);
            }
            else {
                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
                transporter.close();
            }
        });
    });
}
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
                                cedula: negocio.cedula,
                                email: negocio.email,
                                password: negocio.password,
                                tokenTem: token,
                                //negocio
                                nombreNegocio: negocio.nombreNegocio,
                                telefonoNegocio: negocio.telefonoNegocio,
                                direccion: negocio.direccion,
                                envio: negocio.envio,
                                imagen: negocio.imagen,
                                imagenMin: negocio.imagenMin,
                                location: negocio.location,
                                active: negocio.active,
                                tipoPlan: negocio.tipoPlan
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
            console.log("negocio registrado", negocio_Model_1.default);
            res.json({
                res: 'negocio registrado',
                //usuario
                _id: negocio._id,
                nombreUsuario: negocio.nombreUsuario,
                cedula: negocio.cedula,
                email: negocio.email,
                password: negocio.password,
                tokenTem: token,
                //negocio
                telefonoNegocio: negocio.telefonoNegocio,
                direccion: negocio.direccion,
                envio: negocio.envio,
                nombreNegocio: negocio.nombreNegocio,
                imagen: negocio.imagen,
                imagenMin: negocio.imagenMin,
                location: negocio.location,
                active: negocio.active,
                tipoPlan: negocio.tipoPlan
            });
        }
    });
}
exports.loguearsePorToken = loguearsePorToken;
