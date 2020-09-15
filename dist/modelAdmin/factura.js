"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pedidosSchema = new mongoose_1.Schema({
    idFactura: { type: String, required: true },
    iva: { type: Number, required: true, default: 10 },
    envio: { type: Number, required: true },
    //información cliente
    idCliente: { type: String, required: true },
    nombreUsuario: { type: String, required: true },
    cedula: { type: Number, required: true },
    email: { type: String, required: true },
    //informacion del negocio
    idNegocio: { type: String, required: true },
    nombreNegocio: { type: String, required: true },
    imagenNegocio: { type: String, required: true },
    createAt: { type: Date, default: Date.now() }
});
exports.default = mongoose_1.model('factura', pedidosSchema);
