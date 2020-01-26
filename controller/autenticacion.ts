import {Router,Request,Response,NextFunction} from 'express';
import userModel  from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';

export async function crearNuevoUsuario(req:Request,res:Response){
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    console.log(req.body.correo);
    console.log(req.body.nombre);
    console.log(req.body);

    //verificamos si el correo esta disponible

    
    const user:any = await userModel.findOne({email:req.body.correo});

    console.log(user !== null);

    if (!user) {
        //no existe un usuario con este correo por lo que lo guardo
        console.log('no existe un usuario con este user');

        const payloadToken = {
            nombre:req.body.nombre,
            cedula:req.body.cedula
        } 

        const token = await jwt.sign((payloadToken), 'my_secret_token_Key');

        const payload = {
            nombre:req.body.nombre, 
            cedula:req.body.cedula, 
            email:req.body.correo,
            password:req.body.password,
            imagen:req.file.path,
            tempToken:token
        } 

        const user:any = new userModel(payload);
        await user.save();

        res.json({res:'usuario registrado',token,id:user._id,nombre:user.nombre,imgUrl:req.file.path,id_negocio:user.id_negocio,email:user.email});

    }else{

        // ya existe un usuario con este correo
        res.json({res:'La dirección de este correo eléctronico ya esta en uso'});

    }

    
}

export async function loguearse(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    const user:any = await userModel.findOne({email:req.body.correo});   
    console.log(user);    
    if (user === null) {
        //no existe un usuario con este correo por lo que lo puedo guardar
        res.json({res:'correo invalido'});
    }  
    else {
        //ya existe un usuario con este correo
        console.log(req.body.password);
        console.log(user.password);
        bcrypt.compare(req.body.pass,user.password,async function(err, sonIguales) {
            console.log(sonIguales);
            if (err) {
                console.log("err");
                console.log(err);
                res.json({res:err});
            }else{
                if (sonIguales) {
    
                    const payloadToken = {
                        nombre:req.body.nombre,
                        cedula:req.body.cedula
                    } 
        
                    const token = await jwt.sign((payloadToken), 'my_secret_token_Key');

                    await userModel.findByIdAndUpdate(user._id,{tempToken:token});

                    res.json({res:'usuario registrado',token,id:user._id,nombre:user.nombre,imgUrl:user.imagen,email:user.email});

                }else{
                    res.json({res:'pass invalida'});
                }
            }
            
        }); 
        
        
    }
    
}

export async function loguearsePorToken(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    //buscamos el token

    console.log(req.body.token);
    
    const user:any = await userModel.findOne({tempToken:req.body.token});   
    
    console.log(user);    
    
    if (user === null) {

        //no existe un usuario con este token
        res.json({res:'token invalido'});

    }  
    else {

        //ya existe un usuario con este token
        
        const payloadToken = {
            nombre:user.nombre,
            cedula:user.cedula
        }
        
        const token = await jwt.sign((payloadToken), 'my_secret_token_Key');

        await userModel.findByIdAndUpdate(user._id,{tempToken:token});

        res.json({res:'usuario registrado',token,id:user._id,nombre:user.nombre,imgUrl:user.imagen,email:user.email});
        
    }
    
}