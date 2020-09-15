import {Router} from 'express';
import { obtenerPlan } from '../../controller/admin/planes.Data.Acess';

const router = Router();

router.route('/negocio/obtener_plan') 
.post(obtenerPlan);


export default router;