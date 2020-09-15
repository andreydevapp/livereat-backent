import {Schema, model} from 'mongoose';
 
const chatSchema = new Schema({
    //se guarda el id del usuario con el que se habla
    idUser:{type:String,required:true},
    chatCon:{type:String,required:true},
    nombre:{type:String,required:true},
    imagen:{type:String,required:true},
    mensajesSinVer:{type:Number,required:false,default:0},
    ultimoMensaje:{type:String,required:true},
    createAt:{type:Date,default:Date.now()}
    
}); 


export default model('chats', chatSchema);  