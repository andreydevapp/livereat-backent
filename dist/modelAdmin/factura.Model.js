"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pedidoSchema = new mongoose_1.Schema({
    totalSinIva: { type: Number, required: true, default: 0 },
    totalFinal: { type: Number, required: true, default: 0 },
    iva: { type: Number, required: true, default: 0.10 },
    envio: { type: Number, required: true, default: 0 },
    createAt: { type: Date, default: Date.now() },
    condicionPago: { type: String, required: true, default: 'Efectivo' },
    //información cliente
    cliente: {
        idCliente: { type: String, required: true },
        nombreUsuario: { type: String, required: true },
        cedula: { type: Number, required: true },
        email: { type: String, required: true },
        imagenCliente: { type: String, required: true },
        locationCliente: {
            type: { type: String },
            coordinates: [mongoose_1.Schema.Types.Mixed],
        }
    },
    //informacion del negocio
    negocio: {
        idNegocio: { type: String, required: true },
        nombreNegocio: { type: String, required: true },
        imagenNegocio: { type: String, required: true },
        nombrePropietario: { type: String, required: true },
        cedulaPropietario: { type: String, required: true },
        email: { type: String, required: true },
        telefonoNegocio: { type: Number, required: true },
        direccion: { type: String, required: true },
        locationNegocio: {
            type: { type: String },
            coordinates: [mongoose_1.Schema.Types.Mixed],
        }
    },
    //informacion del platillos
    platillos: [{
            idPlatillo: { type: String, required: true },
            nombrePlatillo: { type: String, required: true },
            descripcion: { type: String, required: true },
            imagen: { type: String, required: true },
            cantidad: { type: Number, required: true },
            precio: { type: Number, required: true },
            descuento: { type: Number, required: false, default: 0 },
            subTotal: { type: Number, required: true },
            impuesto: { type: Number, required: true },
            total: { type: Number, required: true },
        }],
    //estados del proceso del platillo
    visto: {
        estado: { type: Boolean, required: false, default: false },
        createAt: { type: Date, default: Date.now() }
    },
    aceptado: {
        estado: { type: Boolean, required: false, default: false },
        createAt: { type: Date, default: Date.now() }
    },
    enProceso: {
        estado: { type: Boolean, required: false, default: false },
        createAt: { type: Date, default: Date.now() }
    },
    enviado: {
        estado: { type: Boolean, required: false, default: false },
        createAt: { type: Date, default: Date.now() }
    },
    entregado: {
        estado: { type: Boolean, required: false, default: false },
        createAt: { type: Date, default: Date.now() }
    },
    cancelado: {
        estado: { type: Boolean, required: false, default: false },
        createAt: { type: Date, default: Date.now() },
        cliente: { type: Boolean, required: false, default: false },
        negocio: { type: Boolean, required: false, default: false }
    },
    seq: { type: Number, default: 0 }
});
var counter = mongoose_1.model('pedidos', pedidoSchema);
pedidoSchema.pre('save', function (next) {
    var doc = this;
    counter.findByIdAndUpdate({ _id: 'entityId' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error)
            return next(error);
        doc.testvalue = counter.seq;
        next();
    });
});
exports.default = mongoose_1.model('pedidos', pedidoSchema);
