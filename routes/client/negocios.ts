import {Router,Request,Response,NextFunction} from 'express';
import { get_Negocio,get_Negocios } from '../../controller/client/negocios.Data.Access';

const router = Router();

//para registrar un nuevo usuario 
router.route('/cliente/get_negocio') 
.get(get_Negocio);

router.route('/cliente/get_negocios/:id') 
.get(get_Negocios);

export default router;