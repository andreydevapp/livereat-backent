"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const planes_Data_Acess_1 = require("../../controller/admin/planes.Data.Acess");
const router = express_1.Router();
router.route('/negocio/obtener_plan')
    .post(planes_Data_Acess_1.obtenerPlan);
exports.default = router;
