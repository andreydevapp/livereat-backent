import {Schema, model} from 'mongoose';

const mensajesSchema = new Schema({
    idUser:{type:String,required:true},
    chatCon:{type:String,required:true},
    de:{type:String,required:true},
    para:{type:String,required:true},
    body:{type:String,required:true},
    visto:{type:Boolean,required:true,default:false},
    remitenteOriginal:{type:String,required:true},
    imagenConsulta:{type:String,required:false},
    createAt:{type:Date,default:Date.now()}
})

export default model('mensajes', mensajesSchema);