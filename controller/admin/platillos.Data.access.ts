import {Router,Request,Response,NextFunction} from 'express';
import platilloModel  from '../../modelAdmin/platillos.Model';
import jwt from 'jsonwebtoken';
import path from 'path';
import { s3DestroyImagen } from "../../services/upload-file";
import sharp from "sharp";
const fs = require('fs');
import aws from 'aws-sdk'; 
import {amazonWs3} from '../../global/environment';
aws.config.update({
    secretAccessKey:amazonWs3.ws3SecretAccessKey,
    accessKeyId:amazonWs3.ws3AccessKeyId,
    region:"us-west-1"
});
const s3 = new aws.S3();

export async function crearNuevoPlatillo(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("Si entre a crear un platillo");

    //validar token para realizar el metodo
    const token = req.body.token;
    console.log(req.body);
    console.log("entre a crear platillo", token);
    
    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({res:'forbiden'});
            console.log('el token no coincide');
        }else{

            //img min
            sharp(req.file.path)
            .resize(100, 100)
            .toFile(__dirname+'/../../temp/images/tumb100/min'+req.file.filename, (err:any, info:any) => { 
                if (err) {
                    console.log("error",err)
                }else{
                    console.log("done");
                    console.log(info);
                    imgNormal(req,res)
                }
            });

            function imgNormal(req:Request,res:Response) {
                //img min
               sharp(req.file.path)
               .resize(2200, 2200)
               .toFile(__dirname+'/../../temp/images/tumb600/'+req.file.filename, (err:any, info:any) => { 
                   if (err) {
                       console.log("error",err)
                   }else{
                       console.log("done");
                       console.log(info);
                       uploadImg(req,res)
                   }
                });
            }

            function uploadImg(req:Request, res:Response) {
            
                const fileContent = fs.readFileSync(__dirname+'/../../temp/images/tumb600/'+req.file.filename);
                // Setting up S3 upload parameters
                const params = {
                    Bucket: amazonWs3.bucketImgPlatillosMin,
                    Key: req.file.filename, // File name you want to save as in S3
                    Body: fileContent,
                    ACL:'public-read'
                };
    
                // Uploading files to the bucket
                s3.upload(params, async function(err:any, data:any) {
                    if (err) {
                        throw err;
                    }else{
                        console.log("archivo subido");
                        
                        uploadImgMin(req, res, data.Location);
                    }
                })
            } 
    
            function uploadImgMin(req:Request, res:Response, locationImg: string){
    
                const fileContent = fs.readFileSync(__dirname+'/../../temp/images/tumb100/min'+req.file.filename);
                // Setting up S3 upload parameters
                const params = {
                    Bucket: amazonWs3.bucketImgPlatillosMin,
                    Key: "min_"+req.file.filename, // File name you want to save as in S3
                    Body: fileContent,
                    ACL:'public-read'
                };
    
                s3.upload(params, async function(err:any, data:any) {
                    if (err) {
                        throw err;
                    }else{
                        console.log("archivo subido min");
                        savePlatillo(req,res,locationImg,data.Location)
                    }
                })
            }
    
            async function savePlatillo(req:Request, res:Response, locationImg: string , locationImgMin: string) {
    
                console.log('el token si coincde');

                const payload = { 

                    //informacion del platillo
                    
                    nombre:req.body.nombre,
                    descripcion:req.body.descripcion,
                    precio:req.body.precio,
                    tipo:req.body.tipo,
                    estado:req.body.estado,
                    imagen:locationImg,  
                    imagenMin:locationImgMin,  
                    
                    //información negocio
        
                    _idNegocio:req.body._idNegocio,
                };
        
                const newPlatillo = await new platilloModel(payload);
                
                await newPlatillo.save();
                
                const platillos:any = await platilloModel.find({_idNegocio:payload._idNegocio, tipo:payload.tipo}   );

                const cantiPlatillos:any = await platilloModel.find({_idNegocio:req.body.idNegocio}).count();
                console.log(platillos);

                res.json({res:'platillos', platillos, cantiPlatillos});
    

            }

        }
    });
    
}

export async function modificarPlatillo(req:Request, res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    const token = req.body.token;

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
    
        if (err) { 

            await fs.unlink(path.resolve(req.file.path));
            res.json({res:'forbiden'});
            console.log('el token no coincide');
            
        }else{
            
            const payload = {

                _id:req.body._id,
                opc:req.body.opc,
                data:req.body.data

            };

            if (payload.opc === "Nombre") {
                await platilloModel.findOneAndUpdate({_id:payload._id},{nombre:payload.data});
            }else if (payload.opc === "Precio") {
                await platilloModel.findOneAndUpdate({_id:payload._id},{precio:payload.data});
            }else if (payload.opc === "Descripcion") {
                await platilloModel.findOneAndUpdate({_id:payload._id},{descripcion:payload.data});
            }

            const platillo:any = await platilloModel.findById({_id:payload._id});
            res.json({res:'platillo',platillo});

        }
    
    });

}

export async function modificarConImagen(req:Request, res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    const token = req.body.token;

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
    
        if (err) {

            res.json({res:'forbiden'});
            console.log('el token no coincide');
            
        }else{

            const rutaImagen = req.body.imgPath;

            const payload = {

                _id:req.body._id,
                imgPath:req.body.imgPath,
                imagen:req.file.path,
                _idNegocio:req.body._idNegocio

            };

            console.log('platillo si entre',payload);

            await platilloModel.findOneAndUpdate({_id:payload._id,_idNegocio:payload._idNegocio},{imagen:payload.imagen});

            await fs.unlink(path.resolve(rutaImagen.toString()));

            const platillo:any = await platilloModel.findById({_id:payload._id});
            res.json({res:'platillo',platillo});

        }
    
    });

}


export async function eliminarPlatillo(req:Request, res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token = req.body.token;

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{

        if (err) {
            res.json({res:'forbiden'});    
        }else{

            console.log("si entre a eliminar el platillo");

            const payload = {
                idPlatillo: req.body.idPlatillo,
                tipo: req.body.tipo,
                idUsuario: req.body.idUsuario,
                token: req.body.token,
                encabezado: req.body.encabezado,
                tipoFiltro: req.body.tipoFiltro,
                rutaImagen: req.body.rutaImagen
            };
            const platillo:any = await platilloModel.findById({_id:payload.idPlatillo});
            await platilloModel.findByIdAndDelete({_id:payload.idPlatillo});
            s3DestroyImagen(amazonWs3.bucketImgPlatillos,platillo.imagen, (err:any) => {
                console.log(err);
                if (err) {
                    console.log("err");
                }
                obtenerLospLatillosConFiltros(req, res, payload);
            });
        
            

            

        }

    })


}

export async function modificarPlatilloEstadoAccesibilidad(req:Request, res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    const token = req.body.token;

    console.log("si llegue");

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
    
        if (err) { 

            await fs.unlink(path.resolve(req.file.path));
            res.json({res:'forbiden'});
            console.log('el token no coincide');
            
        }else{
            console.log("si entre ");
            const payload = {

                idUsuario:req.body._idNegocio,
                _idPlatillo:req.body._idPlatillo,
                query:req.body.query,
                estadoActual:req.body.estadoActual,
                encabezado: req.body.encabezado,
                tipoFiltro: req.body.tipoFiltro,
                tipo: req.body.tipo
                
            };

            console.log(payload);

            switch (payload.query) {
                case "editarEstado":
                    console.log("ntre a editar estado");
                    if (payload.estadoActual === 0) {
                        await platilloModel.findOneAndUpdate({_id:payload._idPlatillo, _idNegocio:payload.idUsuario},{estado:1});
                    }else{
                        await platilloModel.findOneAndUpdate({_id:payload._idPlatillo, _idNegocio:payload.idUsuario},{estado:0});
                    }

                    obtenerLospLatillosConFiltros(req, res, payload);
                    
                break;

                case "editarAccesibilidad":
                    console.log("ntre a editar accesibilidad");
                    if (payload.estadoActual === 0) {
                        await platilloModel.findOneAndUpdate({_id:payload._idPlatillo, _idNegocio:payload.idUsuario},{accesibilidad:1});
                    }else{
                        await platilloModel.findOneAndUpdate({_id:payload._idPlatillo, _idNegocio:payload.idUsuario},{accesibilidad:0});
                    }

                    obtenerLospLatillosConFiltros(req, res, payload);

                break;    
            
                default:
                break;
            }

        }
    
    });

}

export async function obtenerTodosLosPlatillos(req:Request, res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const parametros:string = req.params.id;
    const opciones = parametros.split('separador');

    console.log(opciones);

    const token = opciones[2];

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{

        if (err) {
            res.json({res:'forbiden'});    
        }else{

            const payload = {
                tipo: opciones[0],
                idUsuario: opciones[1],
                token: opciones[2],
                encabezado: opciones[3],
                tipoFiltro: opciones[4]
            };

            obtenerLospLatillosConFiltros(req, res, payload);

        }

    })

}

async function obtenerLospLatillosConFiltros(req:Request, res:Response, payload:any){

    if (payload.encabezado === "fecha") {

        //-1 mas recientes
        //1 mas antiguo            

        console.log("entre a obtener filtro por fecha")

        const platillos:any = await platilloModel.find({_idNegocio:payload.idUsuario, tipo:payload.tipo}).sort( { createAt: payload.tipoFiltro } );

        console.log(platillos);

        if (platillos.length > 0) {
            res.json({res:'platillos', platillos});
        }else{
            if (payload.tipo === 'Platillo') {
                res.json({res:'Sin platillos'});
            }else{
                res.json({res:'Sin bebidas'});
            }
            
        }
        
    }else if(payload.encabezado === "ventas"){

        console.log("wnre a ventas");
    
        const platillos:any = await platilloModel.find({_idNegocio:payload.idUsuario, tipo:payload.tipo}).sort( { ventas:payload.tipoFiltro, createAt: -1  } );

        console.log(platillos);

        if (platillos.length > 0) {
            res.json({res:'platillos', platillos});
        }else{
            if (payload.tipo === 'Platillo') {
                res.json({res:'Sin platillos'});
            }else{
                res.json({res:'Sin bebidas'});
            }
            
        }

    }else if(payload.encabezado === "estado"){

        console.log("entre a estados");

        const platillos:any = await platilloModel.find({_idNegocio:payload.idUsuario, tipo:payload.tipo}).sort( { estado:payload.tipoFiltro, createAt: -1 } );

        console.log(platillos);

        if (platillos.length > 0) {
            res.json({res:'platillos', platillos});
        }else{
            if (payload.tipo === 'Platillo') {
                res.json({res:'Sin platillos'});
            }else{
                res.json({res:'Sin bebidas'});
            }
            
        }

    }else if(payload.encabezado === "accesibilidad"){

        console.log("enre a accesibilidad");

        const platillos:any = await platilloModel.find({_idNegocio:payload.idUsuario, tipo:payload.tipo}).sort( {accesibilidad:payload.tipoFiltro, createAt: -1 } );

        console.log(platillos);

        if (platillos.length > 0) {
            res.json({res:'platillos', platillos});
        }else{
            if (payload.tipo === 'Platillo') {
                res.json({res:'Sin platillos'});
            }else{
                res.json({res:'Sin bebidas'});
            }
            
        }

    }

}

export async function obtenerUnPlatillo(req:Request, res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token = req.body.token;

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{

        if (err) {
            res.json({res:'forbiden'});    
        }else{

            const platillo:any = await platilloModel.findById({_id:req.body.idPlatillo});
            res.json({res:'platillo',platillo});

        }

    })

}


export async function cantiPlatillos(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    const token = req.body.token;
    console.log("entre a canti");

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
    
        if (err) {

            res.json({res:'forbiden'});
            console.log('el token no coincide');
            
        }else{

            const platillos:any = await platilloModel.find({_idNegocio:req.body.idNegocio}).count();
            console.log(platillos);
            res.json({res:'platillos',platillos});

        }
    
    });

}


