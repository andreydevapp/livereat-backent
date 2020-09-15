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
function obtenerLospLatillos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        console.log("req", req.body);
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                // modificar la parte web con las validaciones si existe el token
                //-1 mas recientes
                //1 mas antiguo            
                console.log("entre a obtener filtro por fecha");
                const platillos = yield platillos_Model_1.default.find({ _idNegocio: req.body.idNegocio, tipo: req.body.tipo, accesibilidad: 1 }).sort({ createAt: -1 });
                const cantiPlatillos = yield platillos_Model_1.default.find({ _idNegocio: req.body.idNegocio, tipo: "Platillo" }).count();
                const cantiBebidas = yield platillos_Model_1.default.find({ _idNegocio: req.body.idNegocio, tipo: "Bebida" }).count();
                console.log(platillos);
                if (platillos.length > 0) {
                    res.json({ res: 'platillos', platillos, cantiPlatillos, cantiBebidas });
                }
                else {
                    if (req.body.tipo === 'Platillo') {
                        res.json({ res: 'Sin platillos' });
                    }
                    else {
                        res.json({ res: 'Sin bebidas' });
                    }
                }
            }
        }));
    });
}
exports.obtenerLospLatillos = obtenerLospLatillos;
