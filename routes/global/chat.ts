import {Router,Request,Response,NextFunction} from 'express';
import { getChat, getMensajes, modificarMensajesSinVer } from '../../controller/global/chat.Data.Access'

const router = Router();

//para registrar un nuevo usuario 
router.route('/chat/get_chat') 
.post(getChat);

router.route('/chat/get_mensajes') 
.post(getMensajes);

router.route('/chat/modificar-mensajes-sin-ver') 
.post(modificarMensajesSinVer);

//router.route('/negocio/modificar_estado_chat') 
//.post(getMensajes);

export default router;
