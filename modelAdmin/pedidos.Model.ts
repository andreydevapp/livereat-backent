import {Schema, model} from 'mongoose';

// const pedidosSchema = new Schema({

//   idFactura:{type:String,required:true},

//   //información cliente
//   idCliente:{type:String,required:true},
//   nombreUsuario:{type:String,required:true},
//   cedula:{type:Number,required:true},
//   email:{type:String,required:true},
//   imagenCliente:{type:String,required:true},
//   locationCliente: {
//     type: { type: String },
//     coordinates:[Schema.Types.Mixed],
//   },

//   //informacion del negocio
//   idNegocio:{type:String,required:true},
//   nombreNegocio:{type:String,required:true},
//   imagenNegocio:{type:String,required:true},
//   locationNegocio: {
//     type: { type: String },
//     coordinates:[Schema.Types.Mixed],
//   },

//   //datos del platillo
//   idPlatillo:{type:String,required:true},
//   nombrePlatillo:{type:String,required:true},
//   precio:{type:Number,required:true},
//   cantidad:{type:Number,required:true},
//   imagen:{type:Number,required:true},
//   createAt:{type:Date,default:Date.now()},

//   //estados del proceso del platillo
//   visto:{type:Boolean,required:false,default:false},
//   enProceso:{type:Boolean,required:false,default:false},
//   enviado:{type:Boolean,required:false,default:false},
//   entregado:{type:Boolean,required:false,default:false},
//   cancelado:{type:Boolean,required:false,default:false}
// });


// export default model('pedidos', pedidosSchema);