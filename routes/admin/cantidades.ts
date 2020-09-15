import {Router,Request,Response,NextFunction} from 'express';
import { obtenerCantidadPedidosPlatillos } from '../../controller/admin/cantidades.Data.Access'

const router = Router();


router.route('/negocio/obtener_cantidad_pedidos_platillos') 
.post(obtenerCantidadPedidosPlatillos);


export default router;