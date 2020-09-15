"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_Data_Access_1 = require("../../controller/global/chat.Data.Access");
const router = express_1.Router();
//para registrar un nuevo usuario 
router.route('/chat/get_chat')
    .post(chat_Data_Access_1.getChat);
router.route('/chat/get_mensajes')
    .post(chat_Data_Access_1.getMensajes);
router.route('/chat/modificar-mensajes-sin-ver')
    .post(chat_Data_Access_1.modificarMensajesSinVer);
//router.route('/negocio/modificar_estado_chat') 
//.post(getMensajes);
exports.default = router;
