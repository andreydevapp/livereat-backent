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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const factura_Model_1 = __importDefault(require("../../modelAdmin/factura.Model"));
const platillos_Model_1 = __importDefault(require("../../modelAdmin/platillos.Model"));
function obtenerCantidadPedidosPlatillos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        console.log(req.body);
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ authorization: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                const noVistos = yield factura_Model_1.default.find({ "negocio.idNegocio": req.body.idNegocio, "visto.estado": false }).count();
                const platillos = yield platillos_Model_1.default.find({ _idNegocio: req.body.idNegocio }).count();
                console.log(platillos);
                const ventas = yield factura_Model_1.default.find({ "negocio.idNegocio": req.body.idNegocio, visto: false }).sort({ createAt: -1 }).count();
                ;
                res.json({
                    authorization: 'protected',
                    pedidos: { res: 'pedidos', noVistos },
                    platillos: { res: 'pedidos', platillos },
                    ventas: { res: 'ventas', ventas }
                });
            }
        }));
    });
}
exports.obtenerCantidadPedidosPlatillos = obtenerCantidadPedidosPlatillos;
