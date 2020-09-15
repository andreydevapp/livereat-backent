"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const platillos_Data_Access_1 = require("../../controller/client/platillos.Data.Access");
const router = express_1.Router();
//para registrar un nuevo usuario 
router.route('/cliente/get_platillos')
    .post(platillos_Data_Access_1.obtenerLospLatillos);
exports.default = router;
