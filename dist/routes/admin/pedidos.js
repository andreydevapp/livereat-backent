"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedidos_Data_Access_1 = require("../../controller/admin/pedidos.Data.Access");
const router = express_1.Router();
//para registrar un nuevo usuario 
router.route('/negocio/obtener_facturas')
    .post(pedidos_Data_Access_1.obtenerFacturas);
router.route('/negocio/obtener_pedidos')
    .post(pedidos_Data_Access_1.obtenerPedidos);
router.route('/negocio/obtener_Num_Facturas')
    .post(pedidos_Data_Access_1.obtenerNumFacturas);
router.route('/negocio/modificar_estado_facturas')
    .post(pedidos_Data_Access_1.modificarEstadoFactura);
router.route('/negocio/pdf')
    .post(pedidos_Data_Access_1.pdf);
exports.default = router;
