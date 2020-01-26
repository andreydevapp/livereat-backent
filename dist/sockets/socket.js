"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuarios_lista_1 = require("../classes/usuarios-lista");
const usuario_1 = require("../classes/usuario");
const userModel_1 = __importDefault(require("../models/userModel"));
/*
import notificacionModel from '../models/notificacionModel';

import userFbModel from '../models/userFbModel';
import negocioModel from '../models/negocio.Model';
import mensajeModel from '../models/mensajeModel';
import chatModel from '../models/chatModel';
*/
exports.usuariosConectados = new usuarios_lista_1.UsuariosLista();
exports.conectarCliente = (cliente, io) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('se detecto nuevo cliente');
    const usuario = new usuario_1.Usuario(cliente.id);
    exports.usuariosConectados.agregar(usuario);
});
exports.desconectar = (cliente, io) => {
    cliente.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Cliente desconectado');
        exports.usuariosConectados.borrarUsuario(cliente.id);
    }));
};
// Configurar usuario
exports.configurarUsuario = (cliente, io) => {
    cliente.on('configurar-usuario', (payload, callback) => __awaiter(void 0, void 0, void 0, function* () {
        exports.usuariosConectados.actualizarNombre(cliente.id, payload.id, payload.nombre, payload.imgUrl, payload.opc);
        const user = exports.usuariosConectados.getUsuario(cliente.id);
        if (payload.opc === 'cliente') {
            console.log('usuario conectado');
            console.log(user);
            if (user.userId !== 'sin-id') {
                yield userModel_1.default.findByIdAndUpdate({ _id: user.userId }, { conectado: 1 });
                //obtenemos todos los usuarios
                const users = yield userModel_1.default.find({}, {
                    _id: 1,
                    nombre: 1,
                    email: 1,
                    imagen: 1,
                    id_fb: 1,
                    conectado: 1
                }).sort({ conectado: -1 });
                const estado = {
                    activo: true,
                    idUser: user.userId
                };
                io.emit('usuarios-activos', users);
                io.emit('get-usuario-en-linea', estado);
                callback({
                    ok: true,
                    idWs: cliente.id
                });
            }
        }
        else {
            /*
            if (user.userId !== 'sin-id') {
                await negocioModel.update({idUser:user.userId},{$set: {conectado:1}},{multi:true});
                const negocios:any = await negocioModel.find({},{
                    _id:1,
                    nombre:1,
                    idUser:1,
                    imagen:1,
                    conectado:1
                }).sort({conectado:-1});
    
                if (user.userId !== 'sin-id') {
                    await negocioModel.update({_id:user.userId},{$set: {conectado:1}});
                }
    
                io.emit('negocios-activos', negocios );
    
                callback({
                    ok: true,
                    mensaje:cliente.id
                });
            }
            */
        }
        const estado = {
            activo: true,
            idUser: user.userId
        };
        io.emit('get-usuario-en-linea', estado);
    }));
};
/*
export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('disconnect', async () => {
        console.log('Cliente desconectado');

        const user:any = usuariosConectados.getUsuario(cliente.id);

        if (user.userId !== 'sin-id') {
            if (user.tipoUsuario === 'usuario') {
                await userModel.findByIdAndUpdate({_id:user.userId},{conectado:0});
                const users = await userModel.find({},{
                    _id:1,
                    nombre:1,
                    email:1,
                    imagen:1,
                    id_fb:1,
                    conectado:1
                }).sort({conectado:-1});

                //emitimos que el usuario ya no esta en linea
                const estado = {
                    activo:false,
                    idUser:user.userId
                }

                io.emit('usuarios-activos', users);
                io.emit('get-usuario-en-linea', estado);
            }else{
                await negocioModel.update({_id:user.userId},{$set: {conectado:0}});
                const negocios:any = await negocioModel.find({},{
                    _id:1,
                    nombre:1,
                    idUser:1,
                    imagen:1,
                    conectado:1
                }).sort({conectado:-1});

                console.log(negocios);
                
                io.emit('negocios-activos', negocios );
            }

            const estado = {
                activo:false,
                idUser:user.userId
            };
            io.emit('get-usuario-en-linea', estado);
            
            
        }

        console.log(user);
        console.log(user.userId);

        usuariosConectados.borrarUsuario( cliente.id );
        

    });

}

// Configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', async (  payload: { nombre: string,id : string, imgUrl: string, opc:string }, callback: Function  ) => {
        usuariosConectados.actualizarNombre( cliente.id,payload.id, payload.nombre, payload.imgUrl, payload.opc);
 
        const user:any = usuariosConectados.getUsuario(cliente.id);


        if (payload.opc === 'usuario') {
            console.log('usuario conectado');
            console.log(user);
            if (user.userId !== 'sin-id') {
                await userModel.findByIdAndUpdate({_id:user.userId},{conectado:1});
                            //obtenemos todos los usuarios
                const users = await userModel.find({},{
                    _id:1,
                    nombre:1,
                    email:1,
                    imagen:1,
                    id_fb:1,
                    conectado:1
                }).sort({conectado:-1});

                const estado = {
                    activo:true,
                    idUser:user.userId
                }

                io.emit('usuarios-activos', users);
                io.emit('get-usuario-en-linea', estado);
                callback({
                    ok: true,
                    mensaje:cliente.id
                });
            }

        }else{

            if (user.userId !== 'sin-id') {
                await negocioModel.update({idUser:user.userId},{$set: {conectado:1}},{multi:true});
                const negocios:any = await negocioModel.find({},{
                    _id:1,
                    nombre:1,
                    idUser:1,
                    imagen:1,
                    conectado:1
                }).sort({conectado:-1});
    
                if (user.userId !== 'sin-id') {
                    await negocioModel.update({_id:user.userId},{$set: {conectado:1}});
                }
    
                io.emit('negocios-activos', negocios );
    
                callback({
                    ok: true,
                    mensaje:cliente.id
                });
            }
            
        }

        const estado = {
            activo:true,
            idUser:user.userId
        };
        io.emit('get-usuario-en-linea', estado);

    });

}

export const configurarImgPerfil = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-ImgPerfil', (  payload: { id : string,pathImg: string }, callback: Function  ) => {
        console.log('comfigurando imagen de perfil');
        usuariosConectados.actualizarFotoDeperfil( payload.id, payload.pathImg );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

        callback({
            ok: true,
        });
    });

}

// Obtener Usuarios
export const obtenerUsuarios = async ( cliente: Socket, io: socketIO.Server )  => {

    cliente.on('obtener-usuarios', async () => {
        console.log('imprimiendo');

        //buscamos todos los usuarios activos en la db
        const users = await userModel.find({},{
            _id:1,
            nombre:1,
            email:1,
            imagen:1,
            id_fb:1,
            conectado:1
        }).sort({conectado:-1});

        console.log(users);
        io.to( cliente.id ).emit('usuarios-activos', users  );
        
    });

}

//usuario conectado
export const usuarioEnLinea = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('emitir-esta-en-linea', async (  payload: { id : string}, callback: Function  ) => {
        
        const user:any = usuariosConectados.getUsuarioByIdUser(payload.id);

        //si exite el usuario es que ya fue configurado por lo que el usuario esta en linea

        console.log('esta en linea');
        console.log('usuario',user);

        if (user !== undefined) {
            const estado = {
                activo:true,
                idUser:payload.id
            }
            io.to(cliente.id).emit('get-usuario-en-linea', estado);
        }else{
            const estado = {
                activo:false,
                idUser:payload.id
            }
            io.to(cliente.id).emit('get-usuario-en-linea', estado);
        }

    });

}

// Configurar usuario con negocio
export const configurarUsuarioConNegocio = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario-con-negocio', async (  payload: { id : string,nombre: string, imagen: string }, callback: Function  ) => {
        console.log('comfigurando imagen de perfil');
        const negocios:any = await negocioModel.find();

        console.log(usuariosConectados.getLista());

        io.emit('negocios-activos', negocios );

        callback({
            ok: true,
        });
    });

}



export const obtenerNegocios = async ( cliente: Socket, io: socketIO.Server )  => {

    //obtenemos todos los negocios

    cliente.on('obtener-negocios', async () => {
        console.log('imprimiendo');

        const negocios:any = await negocioModel.find({},{
            _id:1,
            nombre:1,
            idUser:1,
            imagen:1,
            conectado:1
        }).sort({conectado:-1});

        //buscamos todos los usuarios activos en la db

        console.log(negocios);
        io.to( cliente.id ).emit('negocios-activos', negocios  );
        
    });

}

//--------------------------------------------------
//notificaciones

export  const notificacion =  ( cliente: Socket, io: socketIO.Server )  =>  {

    cliente.on('postularse', async (  payload: { idPublicacion:string,
        nombreEmisor:string,
        nombreReceptor:string,
        idUserEmisor:string,
        idUserReceptor:string,
        imgUser:string,
        imagenes:[],
        titulo:string,
        cuerpo:string,
        createAt:string }  ) => {
            
        const notificacion = await notificacionModel.findOne({idPublicacion:payload.idPublicacion,idUserEmisor:payload.idUserEmisor});
        console.log(notificacion);
        if (notificacion === null) {
            const user:any =  usuariosConectados.getUsuarioByIdUser( payload.idUserReceptor );
            const newNoti = new notificacionModel(payload);
            await newNoti.save();
            io.in(user.id).emit( 'notificacion-privada', newNoti );
        }else{
            console.log('este usaurio ya envio una notificacion');
        }
    });

}


// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('enviar-mensaje', async (  payload: { myId:string ,otherId:string ,mensaje:string ,miNombre:string,otherNombre:string ,miImagen:string ,otherImagen:string ,myIdFb:string ,otherIdFb:string, imagenConsulta:string}, callback: Function  ) => {
        

        console.log('entre a get mensjaes');
        console.log(payload.myId);

        //primero se valida al usuario web socket al que se le va a enviar el mensaje
        const userWS:any = usuariosConectados.getUsuarioByIdUser(payload.otherId);

        //primero se valida si el chat con esta persona esta creado
        //en el request tiene que venir el id de los dos usuario

        //myId
        const myId = payload.myId;
        //otherId
        const otherId = payload.otherId;

        const nombreEmisor = payload.miNombre;

        const nombreReceptor = payload.otherNombre;

        const imagenEmisor = payload.miImagen;

        const imagenReceptor = payload.otherImagen;

        const myIdFb = payload.myIdFb;
        
        const otherIdFb = payload.otherIdFb;

        //creo el arreglo
        let modelPayload = {
            idUser:myId,
            chatCon:otherId,
            nombre : nombreEmisor,
            imagen : imagenEmisor,
            id_fb : myIdFb,
            ultimoMensaje:payload.mensaje
        };

        const modelPayloadMsm ={
            idUser:myId,
            chatCon:otherId,
            de:myId,
            para:otherId,
            body:payload.mensaje,
            imagenConsulta:payload.imagenConsulta
        };

        //valido si tengo un chat con eta persona
        const existe = await chatModel.findOne({idUser:myId,chatCon:otherId});

        if (!existe) {

            //ahora hay que validar si el otro usuario tiene un chat conmigo porque los chats se pueden eliminar

            const existeChat = await chatModel.findOne({idUser:otherId,chatCon:myId});

            if (!existeChat) {
                //ninguno de los dos tiene chat por lo que los creo y guardo los datos

                //el que envia el mensaje
                const myChat = new chatModel(modelPayload);
                await myChat.save();

                //guardo el mensaje par el emisor
                const emisorMensaje =  new mensajeModel(modelPayloadMsm);
                await emisorMensaje.save();


                //guardo el chat para el receptor

                modelPayload.idUser = otherId;
                modelPayload.chatCon = myId;
                modelPayload.nombre = nombreReceptor;
                modelPayload.imagen = imagenReceptor;
                modelPayload.id_fb = otherIdFb;
                const otherChat = new chatModel(modelPayload);
                await otherChat.save();

                // guardo el mensaje para el receptor
                modelPayloadMsm.idUser = otherId;
                modelPayloadMsm.chatCon = myId;
                const receptorMensaje =  new mensajeModel(modelPayloadMsm);
                await receptorMensaje.save();

                //listo
                console.log('ninguno de los dos usuarios tenia un chat');
                const mensajes = await mensajeModel.find({idUser:payload.myId,chatCon:payload.otherId}).sort({createAt:1}   );

                
                //sumamos la cantidad de mensajes sin ever del otro usuario en el chatModel
                const chatUser:any = await chatModel.find({idUser:otherId,chatCon:myId});
                chatUser[0].mensajesSinVer += 1;
                
                console.log(chatUser[0].mensajesSinVer);
                            
                await chatModel.update(
                    { idUser:myId,chatCon:otherId },
                    {
                    mensajesSinVer:chatUser[0].mensajesSinVer
                });

                const chatsReceptor:any = await chatModel.find({chatCon:otherId}).sort({createAt:-1});
                const chatsEmisor = await chatModel.find({chatCon:myId}).sort({createAt:-1});

                console.log({res:chatsReceptor[0].mensajesSinVer});
                io.to(userWS.id).emit( 'obtener-chats-receptor-pagina-Home', {res:chatsReceptor[0].mensajesSinVer});
                io.to(userWS.id).emit( 'obtener-chats-receptor', chatsReceptor );
                io.to(cliente.id).emit( 'obtener-chats-emisor', chatsEmisor );
                io.to(userWS.id).emit( 'recibir-mensaje', mensajes );
                io.to(cliente.id).emit( 'recibir-mensaje', mensajes );
                callback({
                    ok: true,
                });

                
            }else{
                //si yo no tengo chat creado pero el otro usuario si tiene uno conmigo entonces guardo el mio y el del  otro lo modifico

                //se guarda el chat del emisor
                const myChat = new chatModel(modelPayload);
                await myChat.save();

                const emisorMensaje =  new mensajeModel(modelPayloadMsm);
                await emisorMensaje.save();

                //modifico el chat del receptor
                await chatModel.update(
                    { idUser: otherId },
                    {
                    createAt:Date.now(),
                    ultimoMensaje:payload.mensaje
                });

                // guardo el mensaje para el receptor
                modelPayloadMsm.idUser = otherId;
                modelPayloadMsm.chatCon = myId;
                const receptorMensaje =  new mensajeModel(modelPayloadMsm);
                await receptorMensaje.save();

                console.log('yo no tenia un chat creado pero el otro si');
                const mensajes = await mensajeModel.find({idUser:payload.myId,chatCon:payload.otherId}).sort({createAt:1}   );

                //sumamos la cantidad de mensajes sin ever del otro usuario en el chatModel
                const chatUser:any = await chatModel.find({idUser:otherId,chatCon:myId});
                chatUser[0].mensajesSinVer += 1;

                await chatModel.update(
                    { idUser:myId,chatCon:otherId },
                    {
                    mensajesSinVer:chatUser[0].mensajesSinVer
                });
                
                const chatsReceptor = await chatModel.find({chatCon:otherId}).sort({createAt:-1});
                const chatsEmisor = await chatModel.find({chatCon:myId}).sort({createAt:-1});

                io.to(userWS.id).emit( 'obtener-chats-receptor', chatsReceptor );
                io.to(cliente.id).emit( 'obtener-chats-emisor', chatsEmisor );
                io.to(userWS.id).emit( 'recibir-mensaje', mensajes );
                callback({
                    ok: true,
                });
            }

        }else{
            //ya tengo un chat creado con el otro usuario

            //ahora hay que validar si el otro usuario tiene un chat conmigo porque los chats se pueden eliminar

            const existeChat = await chatModel.findOne({idUser:otherId,chatCon:myId});

            if (!existeChat) {
                //yo tengo un chat con el otro usuario pero el conmigo no
                //modifico mis datos
                console.log(myId);
                await chatModel.update(
                    { idUser: myId },
                    {
                        createAt:Date.now(),
                        ultimoMensaje:payload.mensaje
                    }
                );

                const emisorMensaje =  new mensajeModel(modelPayloadMsm);
                await emisorMensaje.save();


                //guardo los datos del usuario receptor

                modelPayload.idUser = otherId;
                modelPayload.chatCon = myId;
                modelPayload.nombre = nombreReceptor;
                modelPayload.imagen = imagenReceptor;
                modelPayload.id_fb = otherIdFb;
                const otherChat = new chatModel(modelPayload);
                await otherChat.save();

                // guardo el mensaje para el receptor
                modelPayloadMsm.idUser = otherId;
                modelPayloadMsm.chatCon = myId;
                const receptorMensaje =  new mensajeModel(modelPayloadMsm);
                await receptorMensaje.save();

                //listo
                console.log('yo tengo un chat creado pero el otro no');
                const mensajes = await mensajeModel.find({idUser:payload.myId,chatCon:payload.otherId}).sort({createAt:1}   );

                //sumamos la cantidad de mensajes sin ever del otro usuario en el chatModel
                const chatUser:any = await chatModel.find({idUser:otherId,chatCon:myId});
                chatUser[0].mensajesSinVer += 1;

                await chatModel.update(
                    { idUser:myId,chatCon:otherId },
                    {
                    mensajesSinVer:chatUser[0].mensajesSinVer
                });

                const chatsReceptor = await chatModel.find({chatCon:otherId}).sort({createAt:-1});
                const chatsEmisor = await chatModel.find({chatCon:myId}).sort({createAt:-1});

                io.to(userWS.id).emit( 'obtener-chats-receptor', chatsReceptor );
                io.to(cliente.id).emit( 'obtener-chats-emisor', chatsEmisor );
                io.to(userWS.id).emit( 'recibir-mensaje', mensajes );
                callback({
                    ok: true,
                });
            }else{
                //si se llega hasta aqui significa que los dos tenemos un chat entre nosotros por lo que se le modifica     a los dos

                //modifico mi chat
                await chatModel.update(
                    { idUser:myId,chatCon:otherId },
                    {
                    createAt:Date.now(),
                    ultimoMensaje:payload.mensaje
                });

                 //guardo el mensaje del el emisor
                 const emisorMensaje =  new mensajeModel(modelPayloadMsm);
                 await emisorMensaje.save();

                //modifico el otro chat
                await chatModel.update(
                    { idUser:otherId,chatCon:myId },
                    {
                    createAt:Date.now(),
                    ultimoMensaje:payload.mensaje
                });

                // guardo el mensaje para el receptor
                modelPayloadMsm.idUser = otherId;
                modelPayloadMsm.chatCon = myId;
                const receptorMensaje =  new mensajeModel(modelPayloadMsm);
                await receptorMensaje.save();

                //sumamos la cantidad de mensajes sin ever del otro usuario en el chatModel
                const chatUser:any = await chatModel.find({idUser:myId,chatCon:otherId});
                chatUser[0].mensajesSinVer += 1;
                console.log(chatUser[0].mensajesSinVer);

                await chatModel.update(
                    { idUser:myId,chatCon:otherId },
                    {
                    mensajesSinVer:chatUser[0].mensajesSinVer
                });

                //listo
                console.log('los dos tenemos un chat creado');
                console.log(otherId);
                const mensajes = await mensajeModel.find({idUser:myId,chatCon:otherId}).sort({createAt:1}   );

                const chatsReceptor:any = await chatModel.find({chatCon:otherId}).sort({createAt:-1});
                const chatsEmisor = await chatModel.find({chatCon:myId}).sort({createAt:-1});

                io.to(userWS.id).emit( 'obtener-chats-receptor-pagina-Home', {res:chatsReceptor[0].mensajesSinVer});
                io.to(userWS.id).emit( 'obtener-chats-receptor', chatsReceptor );
                io.to(cliente.id).emit( 'obtener-chats-emisor', chatsEmisor );
                io.to(userWS.id).emit( 'recibir-mensaje', mensajes );
                io.to(cliente.id).emit( 'recibir-mensaje', mensajes );
                callback({
                    ok: true,
                });
            }
        }

    });

}
 
// Obtener Usuarios
export const marcarVisto = async ( cliente: Socket, io: socketIO.Server )  => {

    cliente.on('marcar-visto', async (payload: { myId:string,
        otherId:string}) => {
        console.log('imprimiendo');

        //buscamos todos los usuarios activos en la db

        const userWS:any = usuariosConectados.getUsuarioByIdUser(payload.otherId);
        console.log(userWS);
        
        const visto = {visto:true};

        await mensajeModel.update({idUser:payload.otherId,chatCon:payload.myId},{$set: {visto:true}},{multi:true});

        const mensajes = await mensajeModel.find({idUser:payload.otherId,chatCon:payload.myId}).sort({createAt:1}   );

        io.to( userWS.id ).emit('obtener-visto', mensajes  );
        
    });

}
*/ 
