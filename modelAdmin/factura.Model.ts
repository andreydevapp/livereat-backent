import {Schema, model} from 'mongoose';

const pedidoSchema = new Schema({

    totalSinIva:{type:Number,required:true,default:0},
    totalFinal:{type:Number,required:true,default:0},
    iva:{type:Number,required:true,default:0.10},
    envio:{type:Number,required:true,default:0},
    createAt:{type:Date,default:Date.now()},
    condicionPago:{type:String,required:true,default:'Efectivo'},

    //información cliente
    cliente:{
        idCliente:{type:String,required:true},
        nombreUsuario:{type:String,required:true},
        cedula:{type:Number,required:true},
        email:{type:String,required:true},
        imagenCliente:{type:String,required:true},
        locationCliente: {
            type: { type: String },
            coordinates:[Schema.Types.Mixed],
        }
    },

    //informacion del negocio
    negocio:{
        idNegocio:{type:String,required:true},
        nombreNegocio:{type:String,required:true},
        imagenNegocio:{type:String,required:true},
        nombrePropietario:{type:String,required:true},
        cedulaPropietario:{type:String,required:true},
        email:{type:String,required:true},
        telefonoNegocio:{type:Number,required:true},
        direccion:{type:String,required:true},
        locationNegocio: {
            type: { type: String },
            coordinates:[Schema.Types.Mixed],
        }
    },

    //informacion del platillos
    platillos:[{
        idPlatillo:{type:String,required:true},
        nombrePlatillo:{type:String,required:true},
        descripcion:{type:String,required:true},
        imagen:{type:String,required:true},

        cantidad:{type:Number,required:true},
        precio:{type:Number,required:true},
        descuento:{type:Number,required:false, default:0},
        subTotal:{type:Number,required:true},
        impuesto:{type:Number,required:true},
        total:{type:Number,required:true},
        
    }],

    //estados del proceso del platillo
    visto:{
        estado:{type:Boolean,required:false,default:false},
        createAt:{type:Date,default:Date.now()}
    },
    aceptado:{
        estado:{type:Boolean,required:false,default:false},
        createAt:{type:Date,default:Date.now()}
    },
    enProceso:{
        estado:{type:Boolean,required:false,default:false},
        createAt:{type:Date,default:Date.now()}
    },
    enviado:{
        estado:{type:Boolean,required:false,default:false},
        createAt:{type:Date,default:Date.now()}
    },
    entregado:{
        estado:{type:Boolean,required:false,default:false},
        createAt:{type:Date,default:Date.now()}
    },
    cancelado:{
        estado:{type:Boolean,required:false,default:false},
        createAt:{type:Date,default:Date.now()},
        cliente:{type:Boolean,required:false,default:false},
        negocio:{type:Boolean,required:false,default:false}
    },
    seq: { type: Number, default: 0 }

    
});

var counter:any = model('pedidos', pedidoSchema);


pedidoSchema.pre('save', function(next) {
    var doc:any = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error:any, counter:any)   {
        if(error)
            return next(error);
        doc.testvalue = counter.seq;
        next();
    });
});

export default model('pedidos', pedidoSchema);