"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const imagenDeNegocio_1 = __importDefault(require("../../libs/imagenDeNegocio"));
const autenticacion_Data_Access_1 = require("../../controller/admin/autenticacion.Data.Access");
const router = express_1.Router();
var token2 = '';
//para registrar un nuevo usuario 
router.route('/negocio/registrar_usuario')
    .post(imagenDeNegocio_1.default.single('imagen'), autenticacion_Data_Access_1.crearUsuario);
router.route('/negocio/activar_cuenta')
    .post(autenticacion_Data_Access_1.activarCuenta);
router.route('/negocio/iniciar_sesion')
    .post(autenticacion_Data_Access_1.loguearse);
router.route('/negocio/iniciar_sesion_por_token')
    .post(autenticacion_Data_Access_1.loguearsePorToken);
router.get('negocio/protected', ensureToken, (req, res) => {
    console.log('este es el token: ' + token2);
    jsonwebtoken_1.default.verify(token2, 'my_secret_token_Key', (err, data) => {
        if (err) {
            console.log('fobiden');
            res.json({
                res: 'forbiden'
            });
        }
        else {
            console.log('protected');
            res.json({
                res: 'protected'
            });
        }
    });
});
function ensureToken(req, res, next) {
    token2 = '';
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        token2 = bearerToken;
        next();
    }
    else {
        res.sendStatus(403);
    }
}
exports.default = router;
