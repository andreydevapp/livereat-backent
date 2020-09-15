"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const platillosSchema = new mongoose_1.Schema({
    //informacion del platillo
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, required: true },
    imagenMin: { type: String, required: true },
    tipo: { type: String, required: true },
    estado: { type: Number, required: true },
    accesibilidad: { type: Number, required: true, default: 1 },
    ventas: { type: Number, required: true, default: 0 },
    createAt: { type: Date, default: Date.now() },
    //información negocio
    _idNegocio: { type: String, required: true }
});
exports.default = mongoose_1.model('platillos', platillosSchema);
