import {Router,Request,Response,NextFunction} from 'express';
import platilloModel  from '../../modelAdmin/platillos.Model';

import jwt from 'jsonwebtoken';

export async function obtenerLospLatillos(req:Request, res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    

    const token = req.body.token;
    console.log("req",req.body);

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({res:'forbiden'});
            console.log('el token no coincide');
        }else{
            // modificar la parte web con las validaciones si existe el token
            //-1 mas recientes
            //1 mas antiguo            
        
            console.log("entre a obtener filtro por fecha")
        
            const platillos:any = await platilloModel.find({_idNegocio:req.body.idNegocio, tipo:req.body.tipo, accesibilidad:1}).sort( { createAt: -1 } );
        
            const cantiPlatillos:any = await platilloModel.find({_idNegocio:req.body.idNegocio,tipo:"Platillo"}).count();

            const cantiBebidas:any = await platilloModel.find({_idNegocio:req.body.idNegocio,tipo:"Bebida"}).count();

            console.log(platillos);
        
            if (platillos.length > 0) {
                res.json({res:'platillos', platillos, cantiPlatillos, cantiBebidas});
            }else{
                if (req.body.tipo === 'Platillo') {
                    res.json({res:'Sin platillos'});
                }else{
                    res.json({res:'Sin bebidas'});
                }
                
            }

        }
    });

    

}