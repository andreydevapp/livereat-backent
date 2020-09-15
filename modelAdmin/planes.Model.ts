import {Schema, model} from 'mongoose';

const planesSchema = new Schema({

    //informacion del platillo

    nombrePlan:{type:String,required:true},
    pagoAnual:{
      periodo:{
        meses:{type:Number,required:true},
        descuento:{type:Number,required:true, default:0.10}
      },
      precio:{
        valor:{type:Number,required:true},
        precioConAhorro:{type:Number,required:true}
      }
    },
    pagoSemestral:{
        periodo:{
          meses:{type:Number,required:true},
          descuento:{type:Number,required:true}
        },
        precio:{
          valor:{type:Number,required:true, default:0.5},
          precioConAhorro:{type:Number,required:true}
        }
    },
    pagoMensual:{
        periodo:{
          meses:{type:Number,required:true},
          descuento:{type:Number,required:true}
        },
        precio:{
          valor:{type:Number,required:true},
          precioConAhorro:{type:Number,required:true}
        }
    },
    createAt:{type:Date,default:Date.now()}
  
});


export default model('planes', planesSchema);

