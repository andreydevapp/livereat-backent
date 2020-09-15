import {Schema, model} from 'mongoose';

const platillosSchema = new Schema({

    //informacion del platillo

    nombre:{type:String,required:true},
    descripcion:{type:String,required:true},
    precio:{type:Number,required:true},
    imagen:{type:String,required:true},
    imagenMin:{type:String,required:true},
    tipo:{type:String,required:true},   
    estado:{type:Number,required:true}, //en stock:1 || agotado:0  
    accesibilidad:{type:Number,required:true,default:1}, //publico:1 || oculto:0
    ventas:{type:Number,required:true,default:0},
    createAt:{type:Date,default:Date.now()},

    //información negocio

    _idNegocio:{type:String,required:true}
  
});


export default model('platillos', platillosSchema);