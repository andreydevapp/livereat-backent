"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mensajesSchema = new mongoose_1.Schema({
    idUser: { type: String, required: true },
    chatCon: { type: String, required: true },
    de: { type: String, required: true },
    para: { type: String, required: true },
    body: { type: String, required: true },
    visto: { type: Boolean, required: true, default: false },
    remitenteOriginal: { type: String, required: true },
    imagenConsulta: { type: String, required: false },
    createAt: { type: Date, default: Date.now() }
});
exports.default = mongoose_1.model('mensajes', mensajesSchema);
