"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedidos_Data_Access_1 = require("../../controller/client/pedidos.Data.Access");
const router = express_1.Router();
//para registrar un nuevo usuario 
router.route('/cliente/nuevo_pedido')
    .post(pedidos_Data_Access_1.facturar);
router.route('/cliente/obtener_pedido')
    .post(pedidos_Data_Access_1.obtenerFacturas);
router.route('/cliente/obtener_estados_pedidos')
    .post(pedidos_Data_Access_1.obtenerFacturas);
exports.default = router;
