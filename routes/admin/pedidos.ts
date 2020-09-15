import {Router,Request,Response,NextFunction} from 'express';
import { pedidosVistos,obtenerFacturas, obtenerPedidos,modificarEstadoFactura, obtenerNumFacturas, pdf } from '../../controller/admin/pedidos.Data.Access'

const router = Router();

//para registrar un nuevo usuario 
router.route('/negocio/obtener_facturas') 
.post(obtenerFacturas);

router.route('/negocio/obtener_pedidos') 
.post(obtenerPedidos);

router.route('/negocio/obtener_Num_Facturas') 
.post(obtenerNumFacturas);

router.route('/negocio/modificar_estado_facturas') 
.post(modificarEstadoFactura);

router.route('/negocio/pdf') 
.post(pdf); 


export default router;