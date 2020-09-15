import {Router,Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import facturaModel from '../../modelAdmin/factura.Model';
import platillosModel from '../../modelAdmin/platillos.Model';
 

export async function obtenerCantidadPedidosPlatillos(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token =  req.body.token;

    console.log(req.body);

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({authorization:'forbiden'});
            console.log('el token no coincide');
        }else{

            const noVistos:any = await facturaModel.find({"negocio.idNegocio":req.body.idNegocio,"visto.estado":false}).count();
            
            const platillos:any = await platillosModel.find({_idNegocio:req.body.idNegocio}).count();
            console.log(platillos);

            const ventas:any = await facturaModel.find({"negocio.idNegocio":req.body.idNegocio,visto:false}).sort({createAt: -1}).count();;

            res.json(
            {
                
                authorization:'protected',
                pedidos:{res:'pedidos',noVistos},
                platillos:{res:'pedidos',platillos},
                ventas:{res:'ventas',ventas}
            });
        }
    });   
}