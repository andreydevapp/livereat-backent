import {Router,Request,Response,NextFunction} from 'express';
import negocioModel  from '../../modelAdmin/negocio.Model';
import jwt from 'jsonwebtoken';

export async function get_Negocios(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token = req.params.id;

    console.log("id",req.params.id);
    console.log("tk", token);
    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({res:'forbiden'});
            console.log('el token no coincide');
        }else{
            // modificar la parte web con las validaciones si existe el token
            const negocios = await negocioModel.find().sort({createAt:-1});
            console.log("este es el negoio",negocios);
            res.json(negocios);

        }
    });
    
}

export async function get_Negocio(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token = req.body.token;
    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({res:'forbiden'});
            console.log('el token no coincide');
        }else{
            
            const negocio = await negocioModel.findById({_id:req.body.id});
            res.json(negocio);

        }
    });

    
}