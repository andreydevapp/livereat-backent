import {Router,Request,Response,NextFunction} from 'express';
import userModel  from '../../modelClient/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import nodemailer from 'nodemailer';
import sharp from "sharp";
import fs from 'fs';
import aws from 'aws-sdk'; 
import {amazonWs3} from '../../global/environment';
aws.config.update({
    secretAccessKey:amazonWs3.ws3SecretAccessKey,
    accessKeyId:amazonWs3.ws3AccessKeyId,
    region:"us-west-1"
});

const s3 = new aws.S3();
let mailUser = '';
let nomUser = '';

export async function crearNuevoUsuario(req:Request,res:Response){
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    //verificamos si el correo esta disponible

    const user:any = await userModel.findOne({email:req.body.correo});

    console.log(user !== null);

    if (!user) {
        //no existe un usuario con este correo por lo que lo guardo
        console.log('no existe un usuario con este user');

        

        console.log(__dirname+'/../../images/'+req.file.filename);
        sharp(req.file.path)
        .resize(300, 300)
        .toFile(__dirname+'/../../temp/images/tumb300/min'+req.file.filename, (err:any, info:any) => { 
            if (err) {
                res.json({res:"error",err,path:req.file.path,name:req.file.filename});
                console.log("error",err)
            }else{
                
                uploadImg(req,res)
            }
        });


        function uploadImg(req:Request, res:Response) {
            
            const fileContent = fs.readFileSync(req.file.path);
            // Setting up S3 upload parameters
            const params = {
                Bucket: amazonWs3.bucketImgUser,
                Key: req.file.filename, // File name you want to save as in S3
                Body: fileContent,
                ACL:'public-read'
            };

            // Uploading files to the bucket
            s3.upload(params, async function(err:any, data:any) {
                if (err) {
                    console.log("me cai subiendo la imagen");
                    throw err;
                }else{
                    console.log("archivo subido");
                    
                    uploadImgMin(req, res, data.Location);
                }
            })
        } 

        function uploadImgMin(req:Request, res:Response, locationImg: string){

            const fileContent = fs.readFileSync(__dirname+'/../../temp/images/tumb300/min'+req.file.filename);
            // Setting up S3 upload parameters
            const params = {
                Bucket: amazonWs3.bucketImgUserMin,
                Key: "min_"+req.file.filename, // File name you want to save as in S3
                Body: fileContent,
                ACL:'public-read'
            };

            s3.upload(params, async function(err:any, data:any) {
                if (err) {
                    console.log("me cai subiendo la imagen");
                    throw err;
                }else{
                    console.log("archivo subido min");
                    saveUser(req,res,locationImg,data.Location)
                }
            })
        }

        async function saveUser(req:Request, res:Response, locationImg: string , locationImgMin: string){
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
                imagen:locationImg,
                imagenMin:locationImgMin,
                tempToken:token
            } 
    
            const user:any = new userModel(payload);
            await user.save();
    
            res.json({res:'usuario registrado',token,id:user._id,nombre:user.nombre,imgUrl:user.imagen,imagenMin:user.imagenMin,id_negocio:user.id_negocio,email:user.email});

            mailUser = user.email;
            nomUser = user.nombre;

            sendEmail()
        }

        async function sendEmail() {
        
            const transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                secure: false,
                tls: {
                    rejectUnauthorized: false
                },
                auth: {
                    user: 'aocastillo@est.utn.ac.cr',
                    pass: 'Fail0412*'
                }
            });
        
            const html = `<div style="width: 85%; text-align: center; margin: auto;" media="(min-width: 465px)">
            <img style="width:220px; height:90px; margin: auto;"  src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/logo.PNG" alt="">
            <br><br>
            <span style="font-size: 18px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #44d1ea;">
                ¿Listo para descubrir Livereat?
            </span>
            <span>
                <img width="15px" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/rocket.png" alt="">
            </span>
            <div style="padding-top: 10px;"></div>
            <p style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Disfrutá de los mejores restaurantes de tu ciudad a sólo un clic de distancia. Pedí hoy lo que querás a través de Livereat.
            </p>
            <p style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #44d1ea;">
                Seguí estos pasos para ordenar:
            </p>
        
            <div style="text-align: left;">
                <li style="color: #44d1ea;">
                    <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                        Abrí la aplicación de <strong>Libereat</strong> y registrate.
                    </span>
                </li>
                <li style="color: #44d1ea;">
                    <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                        Seleccioná el restaurante que se te antoje o <strong>descubrí uno nuevo en tu zona.</strong> 
                    </span>
                </li>
                <li style="color: #44d1ea;">
                    <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                        Seleccioná el platillo, <strong>confirmá tu orden y, ¡listo!</strong>
                    </span>
                </li>
            </div>
        
            <br>
        
            <span style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Puedes covertirte en un Livereat Admin, haz click aquí para ver nuestros planes.
            </span>
            <br>
            <br>
            <button style="font-style: none; padding-top: 10px; padding-bottom: 10px; padding-left: 25px; padding-right: 25px; background-color: #44d1ea; color: white; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; border: none; border-radius: 10px;">
                app.livereat.com
            </button>
            <br>
            <br>
            <br>
            <div style="height: 1px; background-color: #d4d4d4;"></div>
            <br>
            <br>
            <br>
            <br>
            <span>
                <img style="width:17px" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/lifebuoy.png" alt=""> 
            </span>
            <span style="font-size: 20px; color: #44d1ea; font-weight: 400; font-family:  sans-serif; line-height: 30px;">
                 Centro de <strong>Ayuda</strong> 
            </span>
            <br><br>
            <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Consulta <a style="font-style: none; font-size: 14px; color: #44d1ea; font-weight: 400; font-family:  sans-serif; line-height: 20px;" href="#">aquí</a> la documentación y aprende paso a paso a usar todas las funcionalidades de la aplicación.
            </span><br><br>
            <span style="font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Si tienes dudas puedes escribirnos en <a style="font-style: none; font-size: 14px; color: #44d1ea; font-weight: 400; font-family:  sans-serif; line-height: 20px;" href="#">livereat.com/123</a> 
            </span>
            <br><br><br>
            <span style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Con Livereat Ganas Tiempo y Tranquilidad
            </span>
            <br>
            <br>
            <div  style="width: 100%; ">
                <div style="display: inline-block; margin: auto;">
                     <img style="width: 100px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/app_store.png" alt="">
                </div>
                <div style="display: inline-block;">
                     <img style="width: 100px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/google_play.png" alt="">
                </div>
            </div>
            <br>
            <div  style="width: 100%; ">
                <div style="display: inline-block; margin: auto; padding-right: 15px;">
                    <a style="font-style: none;" href="https://twitter.com/">
                        <img style="width: 30px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/twitter.png" alt="">
                    </a>
                </div>
                <div style="display: inline-block; padding-right: 15px;">
                    <a style="font-style: none;" href="https://www.facebook.com/">
                        <img style="width: 30px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/facebook.png" alt="">
                    </a>
                </div>
                <div style="display: inline-block; margin: auto; padding-right: 15px;">
                    <a style="font-style: none;" href="https://www.instagram.com/">
                        <img style="width: 30px; height: 30px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/instagram.png" alt="">
                    </a>
               </div>
               <div style="display: inline-block;">
                    <a style="font-style: none;" href="https://www.youtube.com/">
                        <img style="width: 35px; height: 35px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/youtube.png" alt="">
                    </a>
               </div>
            </div>
            <br>
            <span style="text-align: left !important; font-size: 12px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                © Livereat - Todos los derechos reservados
            </span><br>
            <span>
                <img style="width: 11px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/costa-rica.png" alt="">
            </span>
            <span style="text-align: left !important; font-size: 12px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                Hecho con <span> <img style="width: 11px;" src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/heart.png" alt=""></span> en Costa Rica
            </span>
        </div>`;
        
            console.log(mailUser);
            console.log(nomUser);

            transporter.sendMail({
                from: 'Livereat <aocastillo@est.utn.ac.cr>', // sender address
                to: mailUser, // list of receivers
                subject:  `Bienvenido a Livereat ${nomUser}`, // Subject line
                text: "", // plain text body
                html, // html body
            }, (err:any,info:any) => {
                if (err) {
                    
                    console.log("hubo un error",err);
                }else{
                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    transporter.close();
                }
            });
        
        
        }
        

        

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