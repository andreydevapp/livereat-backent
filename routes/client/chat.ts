import {Router,Request,Response,NextFunction} from 'express';
import { getChat, getMensajes } from '../../controller/global/chat.Data.Access'

const router = Router();

//para registrar un nuevo usuario 
router.route('/cliente/chat') 
.post(getChat);

router.route('cliente/get_mensajes') 
.post(getMensajes);

//router.route('/cliente/modificar_estado_chat') 
//.post(getMensajes);



export default router;