"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    //se guarda el id del usuario con el que se habla
    idUser: { type: String, required: true },
    chatCon: { type: String, required: true },
    nombre: { type: String, required: true },
    imagen: { type: String, required: true },
    mensajesSinVer: { type: Number, required: false, default: 0 },
    ultimoMensaje: { type: String, required: true },
    createAt: { type: Date, default: Date.now() }
});
exports.default = mongoose_1.model('chats', chatSchema);
