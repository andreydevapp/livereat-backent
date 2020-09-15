import {Router,Request,Response,NextFunction} from 'express';
import { obtenerLospLatillos } from '../../controller/client/platillos.Data.Access';

const router = Router();

//para registrar un nuevo usuario 
router.route('/cliente/get_platillos') 
.post(obtenerLospLatillos);


export default router;