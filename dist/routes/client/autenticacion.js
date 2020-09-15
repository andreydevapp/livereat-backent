"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const autenticacion_Data_Access_1 = require("../../controller/client/autenticacion.Data.Access");
const imagenDeUsuario_1 = __importDefault(require("../../libs/imagenDeUsuario"));
const router = express_1.Router();
var token2 = '';
//para registrar un nuevo usuario 
router.route('/cliente/registrar_usuario')
    .post(imagenDeUsuario_1.default.single('imagen'), autenticacion_Data_Access_1.crearNuevoUsuario);
router.route('/cliente/iniciar_sesion')
    .post(autenticacion_Data_Access_1.loguearse);
router.route('/cliente/iniciar_sesion_por_token')
    .post(autenticacion_Data_Access_1.loguearsePorToken);
router.get('/protected', ensureToken, (req, res) => {
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
