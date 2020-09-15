import {Router,Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import multerImgNegocio from '../../libs/imagenDeNegocio'
import { activarCuenta, loguearsePorToken, loguearse, crearUsuario } from '../../controller/admin/autenticacion.Data.Access';

const router = Router();
var token2:string = '';

//para registrar un nuevo usuario 
router.route('/negocio/registrar_usuario') 
.post(multerImgNegocio.single('imagen'),crearUsuario);

router.route('/negocio/activar_cuenta') 
.post(activarCuenta);

router.route('/negocio/iniciar_sesion') 
.post(loguearse);

router.route('/negocio/iniciar_sesion_por_token') 
.post(loguearsePorToken);

router.get('negocio/protected',ensureToken ,(req:Request,res:Response) => {
    console.log('este es el token: '+token2);
    jwt.verify(token2,'my_secret_token_Key',(err,data)=>{
        if (err) {
            console.log('fobiden');
            res.json({
                res:'forbiden'
            })
        }else{
            console.log('protected')
            res.json({
                res:'protected'
            })
        }
    });
});

function ensureToken(req:Request,res:Response,next:NextFunction){
    token2='';   
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
       const bearer = bearerHeader.split(' ');
       const bearerToken = bearer[1];
       token2 = bearerToken;
       next();
    }else{
       res.sendStatus(403);
    }
}

export default router;