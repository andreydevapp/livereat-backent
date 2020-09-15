import {Router,Request,Response,NextFunction} from 'express';

import mensajeModel from '../../modelGlobal/mensajes.Model';
import chatModel from '../../modelGlobal/chats.Model';
import jwt from 'jsonwebtoken';


export async function getChat(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token = req.body.token;

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{

        if (err) {
            res.json({res:'forbiden'});    
        }else{

            console.log("entre a get chat");

            const id = req.body.id;
            console.log(id);

            const chats = await chatModel.find({chatCon:id}).sort({createAt:1});
            res.json(chats);

        }

    });

}

export async function getMensajesSinVer(req:Request,res:Response){

    const id = req.params.id;
    console.log(id);

    const chat:any = await chatModel.find({chatCon:id}).limit(1);

    console.log(chat);
    console.log(chat[0].mensajesSinVer);
    
    res.json({res:chat[0].mensajesSinVer});

}


export async function modificarMensajesSinVer(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token = req.body.token;

    console.log("si entre");

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{

        if (err) {
            res.json({res:'forbiden'});    
        }else{

            console.log("modificar mensajes sin ver");

            //myId
            const myId = req.body.myId;
            //otherId
            const otherId = req.body.otherId; 
                
            //sumamos la cantidad de mensajes sin ever del otro usuario en el chatModel
            const chatUser:any = await chatModel.find({idUser:otherId,chatCon:myId});
                
                
            chatUser[0].mensajesSinVer = 0;
                
            await chatModel.update(
                { idUser:otherId,chatCon:myId },
                { 
                mensajesSinVer:chatUser[0].mensajesSinVer 
            });
        
            res.json({res:"Datos modificados"});

        }

    });

    

}

export async function getMensajes(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token = req.body.token;

    console.log("si entre");

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{

        if (err) {
            res.json({res:'forbiden'});    
        }else{

            console.log("entre a obtener los mensajaes");
            const chats = await mensajeModel.find({idUser:req.body.myId,chatCon:req.body.otherId}).sort({createAt:1});
            res.json(chats);

        }

    });

    
}