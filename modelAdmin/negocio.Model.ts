import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const negocioSchema = new Schema({

  //información personal

  nombreUsuario:{type:String,required:true, default:'sin-nombreUsuario'},
  cedula:{type:Number,required:true, default:0},
  codigoCedula:{type:String,required:true, default:"sin-codigo"},
  email:{type:String,required:true},
  password:{type:String,required:true},
  tokenTem:{type:String,required:true},
  
  //informacion del negocio

  location: {
    type: { type: String },
    coordinates:[Schema.Types.Mixed],
  },

  nombreNegocio:{type:String,required:true},
  telefonoNegocio:{type:Number,required:true,default:0},
  direccion:{type:String,required:true,default:'sin-direccion'},
  provincia:{type:Number,required:true,default:0},
  canton:{type:String,required:true,default:'sin-canton'},
  distrito:{type:String,required:true,default:'sin-distrito'},
  imagen:{type:String,required:true,default:'sin-imagen'},
  imagenMin:{type:String,required:true,default:'sin-imagenMin'},
  envio:[{
    lugar:{type:String,required:false},
    precio:{type:Number,required:false}
  }],
  tipoPlan:{type:String,required:false,default:'Prueba'},
  active:{type:Boolean,required:true,default:false},
  conectado:{type:Number,required:true,default:1},   
  privateKey:{type:String,required:false,default:'Sin-llave'},
  publicKey:{type:String,required:false,default:'Sin-llave'},
  pinKey:{type:String,required:false,default:'Sin-pin'},
  passwd:{type:String,required:false,default:'Sin-pass'},
  createAt:{type:Date,default:Date.now()}
},
{
  timestamps: true
})

negocioSchema.index({ 'location.coordinates': "2d" });

negocioSchema.pre('save',function(next){
  const usuario:any = this;
  console.log(usuario);
  if (!usuario.isModified('password')) {
      return next();
  }
  bcrypt.genSalt(10,(err,salt) =>{
      if (err) {
          next(err);
      }
      const a:any = null;
      bcrypt.hash(usuario.password, salt,a, (err, hash) => {
          if (err) {
              next(err);
          }
          usuario.password = hash;
          console.log(usuario);
          next();
      })
  });
})

export default model('negocios', negocioSchema);