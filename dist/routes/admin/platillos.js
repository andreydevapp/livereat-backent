"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const platillos_Data_access_1 = require("../../controller/admin/platillos.Data.access");
const imagenDePlatillo_1 = __importDefault(require("../../libs/imagenDePlatillo"));
const imagenDeBebidas_1 = __importDefault(require("../../libs/imagenDeBebidas"));
const router = express_1.Router();
//para registrar un nuevo usuario 
router.route('/negocio/crear_platillo')
    .post(imagenDePlatillo_1.default.single('imagen'), platillos_Data_access_1.crearNuevoPlatillo);
router.route('/negocio/crear_bebida')
    .post(imagenDeBebidas_1.default.single('imagen'), platillos_Data_access_1.crearNuevoPlatillo);
router.route('/negocio/modificar_platillo')
    .post(platillos_Data_access_1.modificarPlatillo);
router.route('/negocio/modificar_estado_accesibilidad')
    .post(platillos_Data_access_1.modificarPlatilloEstadoAccesibilidad);
router.route('/negocio/modificar_platillo_con_imagen')
    .post(imagenDePlatillo_1.default.single('imagen'), platillos_Data_access_1.modificarConImagen);
router.route('/negocio/modificar_bebida_con_imagen')
    .post(imagenDeBebidas_1.default.single('imagen'), platillos_Data_access_1.modificarConImagen);
router.route('/negocio/obtener_todos_los_platillos/:id')
    .get(platillos_Data_access_1.obtenerTodosLosPlatillos);
router.route('/negocio/obtener_un_platillo')
    .post(platillos_Data_access_1.obtenerUnPlatillo);
router.route('/negocio/obtener_cantidad_platillos')
    .post(platillos_Data_access_1.cantiPlatillos);
router.route('/negocio/eliminar_platillo')
    .post(platillos_Data_access_1.eliminarPlatillo);
exports.default = router;
