"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const negocios_Data_Access_1 = require("../../controller/client/negocios.Data.Access");
const router = express_1.Router();
//para registrar un nuevo usuario 
router.route('/cliente/get_negocio')
    .get(negocios_Data_Access_1.get_Negocio);
router.route('/cliente/get_negocios/:id')
    .get(negocios_Data_Access_1.get_Negocios);
exports.default = router;
