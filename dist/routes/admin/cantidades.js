"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cantidades_Data_Access_1 = require("../../controller/admin/cantidades.Data.Access");
const router = express_1.Router();
router.route('/negocio/obtener_cantidad_pedidos_platillos')
    .post(cantidades_Data_Access_1.obtenerCantidadPedidosPlatillos);
exports.default = router;
