import {Router} from 'express';
import { crearNuevoPlatillo, modificarPlatillo, obtenerTodosLosPlatillos, eliminarPlatillo,modificarPlatilloEstadoAccesibilidad, obtenerUnPlatillo, modificarConImagen, cantiPlatillos } from '../../controller/admin/platillos.Data.access';
import multerImagenDePlatillo from '../../libs/imagenDePlatillo';
import multerImagenDeBebida from '../../libs/imagenDeBebidas';

const router = Router();

//para registrar un nuevo usuario 
router.route('/negocio/crear_platillo') 
.post(multerImagenDePlatillo.single('imagen'),crearNuevoPlatillo);

router.route('/negocio/crear_bebida') 
.post(multerImagenDeBebida.single('imagen'),crearNuevoPlatillo);

router.route('/negocio/modificar_platillo') 
.post(modificarPlatillo);

router.route('/negocio/modificar_estado_accesibilidad') 
.post(modificarPlatilloEstadoAccesibilidad);

router.route('/negocio/modificar_platillo_con_imagen') 
.post(multerImagenDePlatillo.single('imagen'),modificarConImagen);

router.route('/negocio/modificar_bebida_con_imagen') 
.post(multerImagenDeBebida.single('imagen'),modificarConImagen);

router.route('/negocio/obtener_todos_los_platillos/:id') 
.get(obtenerTodosLosPlatillos);

router.route('/negocio/obtener_un_platillo') 
.post(obtenerUnPlatillo);

router.route('/negocio/obtener_cantidad_platillos') 
.post(cantiPlatillos);

router.route('/negocio/eliminar_platillo') 
.post(eliminarPlatillo);

export default router;