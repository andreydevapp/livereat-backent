import {Router,Request,Response,NextFunction} from 'express';
import { facturar, obtenerFacturas } from '../../controller/client/pedidos.Data.Access';

const router = Router();

//para registrar un nuevo usuario 
router.route('/cliente/nuevo_pedido') 
.post(facturar);

router.route('/cliente/obtener_pedido') 
.post(obtenerFacturas);

router.route('/cliente/obtener_estados_pedidos') 
.post(obtenerFacturas);

export default router;