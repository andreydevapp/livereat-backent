"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_Data_Access_1 = require("../../controller/global/chat.Data.Access");
const router = express_1.Router();
//para registrar un nuevo usuario 
router.route('/cliente/chat')
    .post(chat_Data_Access_1.getChat);
router.route('cliente/get_mensajes')
    .post(chat_Data_Access_1.getMensajes);
//router.route('/cliente/modificar_estado_chat') 
//.post(getMensajes);
exports.default = router;
