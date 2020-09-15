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
const negocio_Model_1 = __importDefault(require("../../modelAdmin/negocio.Model"));
const userModel_1 = __importDefault(require("../../modelClient/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const factura_Model_1 = __importDefault(require("../../modelAdmin/factura.Model"));
const platillos_Model_1 = __importDefault(require("../../modelAdmin/platillos.Model"));
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const dateformat_1 = __importDefault(require("dateformat"));
const convertir = require('numero-a-letras');
const imageDownloader = require('node-image-downloader');
const request_1 = __importDefault(require("request"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const gpayments = require('gpayments');
let imgMinNegocio = '';
let nombreNegocio = '';
let nombreCliente = '';
let emailCliente = '';
let emailNegocio = '';
let claveFactura = '';
let consecutivo = '';
let codigoActividad = 0;
let negocioDataGlobal = [];
function facturar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        res.setHeader("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'); // If needed
        // const customer = await gpApi.customers.create({
        //     name: 'Bruce Banner',
        //     email: 'brucebanner@hulk.com',
        //     currency: 'usd',
        //     credit_card_number: 4242424242424242,
        //     credit_card_security_code_number: 123,
        //     exp_month: 12,
        //     exp_year: 2035
        //   })
        // console.log(customer);
        // await gpApi.charges.create({
        //     amount: 90.32,
        //     customer_key: 'GfGsOKTZVlTKyn7khcihXYuEUx0nBxb',
        //     description: 'Plan 1 service charge',
        //     entity_description: 'Plan 1',
        //     currency: 'usd',
        // });
        const token = req.body.token;
        console.log("si entre");
        console.log("entre a crear una factura");
        console.log("pedido", req.body);
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                procesarPago(req, res);
            }
        }));
    });
}
exports.facturar = facturar;
function procesarPago(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const gpApi = gpayments({
            clientId: 'yWVcZkdLqjSRjas4tGxKwJGZR2dUXVQqiLSevFZV',
            clientSecret: '9wujKuTfJPwVKWikNoM6JGeWj4yYY6d7juQ03pf982UcmxJmcE1RTHdv21RK1OFO0WL1nyXbgoZfdxvEbmHEjN6XwNTBUfoyJTvzFj7W1dvG23jxCXefD5bAeM9qpWEZ'
        });
        const account = yield gpApi.me.fetch();
        console.log(account);
        const accountBN = yield gpApi.me.update({ bank_name: 'BN', test: false });
        console.log(accountBN);
        const customers = yield gpApi.customers.fetch();
        console.log(customers);
        const totalEnDolar = 0.0018 * 14000;
        const pay = yield gpApi.charges.create({
            amount: totalEnDolar,
            description: 'Pago de ' + req.body.propietario,
            entity_description: 'Visa',
            currency: 'usd',
            credit_card_number: parseInt(req.body.numCard),
            credit_card_security_code_number: parseInt(req.body.cvv),
            exp_month: req.body.mes,
            exp_year: req.body.ano
        }).catch((e) => {
            console.log("error", e);
            if (e === "Your card number is incorrect. Please check the values.") {
                console.log("numero de tarjeta incorrecto");
                res.json({ res: "card-number-is-incorrect" });
            }
            else {
                console.log("incorrecto");
                res.json({ res: "card-error" });
            }
        });
        if (pay !== undefined) {
            console.log("pago procesado correctamente");
            loadDataToDb(req, res);
        }
        else {
            console.log("no se pudo procesar el pago");
        }
    });
}
function loadDataToDb(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const negocio = req.body.negocio;
        console.log("negocio", negocio);
        let listaPlatillos = [];
        let totalSinIva = 0;
        let totalFinal = 0;
        let cobroIva = 0;
        let precioEnvio = 0;
        let iva = 0.13;
        let error = false;
        const negocioData = yield negocio_Model_1.default.findById(negocio.idNegocio);
        negocioDataGlobal = negocioData;
        const clienteData = yield userModel_1.default.findById(req.body.idCliente);
        const cantiFacturas = yield factura_Model_1.default.find().count();
        codigoActividad = cantiFacturas;
        consecutivo = "";
        for (let i = 0; i < 10 - cantiFacturas.toString().length; i++) {
            consecutivo = consecutivo + "0";
        }
        console.log(consecutivo);
        consecutivo = consecutivo + cantiFacturas.toString();
        console.log(consecutivo);
        const myNumeroAleatorio1 = Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;
        const myNumeroAleatorio2 = Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;
        claveFactura = "506" + negocioData.cedula.toString() + myNumeroAleatorio1.toString() + myNumeroAleatorio2.toString();
        const payloadFirm = {
            "PIN": negocioData.pinKey,
            "llave_privada": negocioData.privateKey,
            "clave_factura": claveFactura
        };
        request_1.default.post('http://104.248.58.128:7777/firmar', { json: payloadFirm }, (error, resDes, bodyRes) => __awaiter(this, void 0, void 0, function* () {
            if (error) {
                console.error(error);
                return;
            }
        }));
        if (negocioData && clienteData || negocioData.length > 0 && clienteData.length > 0) {
            for (const platillo of negocio.pedidos) {
                let platilloData = yield platillos_Model_1.default.findById(platillo.idPlatillo);
                console.log("platillo", platillo);
                if (platillo || platillo.length > 0) {
                    let payloadPlatillo = {
                        idPlatillo: platilloData._id,
                        nombrePlatillo: platilloData.nombre,
                        descripcion: platilloData.descripcion,
                        imagen: platilloData.imagen,
                        cantidad: platillo.cantidad,
                        precio: platilloData.precio,
                        descuento: 0,
                        subTotal: (platillo.cantidad * platilloData.precio) - 0,
                        impuesto: (platillo.cantidad * platilloData.precio) * (0.13) - 0,
                        total: (platillo.cantidad * platilloData.precio) + (platillo.cantidad * platilloData.precio * (0.13)) - 0
                    };
                    listaPlatillos.push(payloadPlatillo);
                    totalSinIva += platilloData.precio * platillo.cantidad;
                }
                else {
                    error = true;
                    break;
                }
            }
            //hay que guardar la factura
            cobroIva = totalSinIva * iva;
            const envioSolicitado = yield negocio.zonasDeEnvio.filter(function (zona) {
                return zona.check === true;
            });
            console.log(envioSolicitado[0]);
            if (envioSolicitado.length > 0) {
                console.log(negocioData.envio);
                const zonaDeEnvio = yield negocio.zonasDeEnvio.filter(function (zona) {
                    return zona.id === envioSolicitado[0].id;
                });
                console.log(zonaDeEnvio);
                console.log(zonaDeEnvio.length);
                if (zonaDeEnvio.length > 0) {
                    console.log("si entre");
                    totalFinal = cobroIva + totalSinIva + zonaDeEnvio[0].precio;
                    precioEnvio = zonaDeEnvio[0].precio;
                }
            }
            else {
                totalFinal = cobroIva + totalSinIva;
            }
        }
        else {
            error = true;
        }
        if (!error) {
            console.log("entre a guardar  factura");
            yield guardarFactura(req, res, clienteData, negocioData, listaPlatillos, totalSinIva, totalFinal, precioEnvio);
            res.json({ res: "Pedido realizado" });
            const imgNegocio = negocioData.imagenMin;
            imgMinNegocio = negocioData.imagenMin;
            nombreNegocio = negocioData.nombreNegocio;
            nombreCliente = clienteData.nombre;
            emailCliente = clienteData.email;
            emailNegocio = negocioData.email;
            descargarImg(imgNegocio, req, res, negocioData);
        }
        else {
            res.json({ res: 'Pedido no realizado' });
        }
    });
}
let facturaGlobal = [];
function guardarFactura(req, res, cliente, negocio, platillos, totalSinIva, totalFinal, precioEnvio) {
    return __awaiter(this, void 0, void 0, function* () {
        let payloadFactura = {
            totalSinIva,
            totalFinal,
            envio: precioEnvio,
            condicionPago: 'Efectivo',
            //información cliente
            cliente: {
                idCliente: cliente._id,
                nombreUsuario: cliente.nombre,
                cedula: cliente.cedula,
                email: cliente.email,
                imagenCliente: cliente.imagen,
                locationCliente: {
                    type: "Point",
                    coordinates: [req.body.lonCliente, req.body.latCliente],
                },
            },
            negocio: {
                idNegocio: negocio._id,
                nombreNegocio: negocio.nombreNegocio,
                imagenNegocio: negocio.imagenMin,
                nombrePropietario: negocio.nombreUsuario,
                cedulaPropietario: negocio.cedula,
                email: negocio.email,
                telefonoNegocio: negocio.telefonoNegocio,
                direccion: negocio.direccion,
                locationNegocio: {
                    type: "Point",
                    coordinates: [negocio.location.coordinates[0], negocio.location.coordinates[1]],
                }
            },
            //informacion del negocio
            platillos
        };
        const newFactura = new factura_Model_1.default(payloadFactura);
        facturaGlobal = newFactura;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            resolve(yield newFactura.save());
        }));
    });
}
let imgPathMin = __dirname + '/../../temp/images/test.jpg';
function descargarImg(imgNegocio, req, res, negocioData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(imgNegocio);
        request_1.default({
            url: imgNegocio,
            //make the returned body a Buffer
            encoding: null
        }, function (error, response, body) {
            //will be true, body is Buffer( http://nodejs.org/api/buffer.html )
            console.log(body instanceof Buffer);
            //do what you want with body
            //like writing the buffer to a file
            fs_1.default.writeFile(__dirname + '/../../temp/images/test.jpg', body, {
                encoding: null
            }, function (err) {
                if (err)
                    res.json({ res: "img no guardada", err });
                else {
                    console.log('It\'s saved!');
                    //buildJsonToXml(res);
                    crearPdf(req, res, negocioData);
                }
            });
        });
        // return new Promise(async resolve => {
        //     resolve(
        //         imageDownloader({
        //             imgs: [
        //               {
        //                 uri: imgNegocio,
        //                 filename: 'my-img-min'
        //               }
        //             ],
        //             dest:__dirname, //destination folder
        //           })
        //         .then((info:any) => {
        //             console.log('all done', info);
        //             console.log('path', info[0].path);
        //             imgPathMin = info[0].path;
        //             
        //         })
        //         .catch((error:any, response:any, body:any) => {
        //           console.log('something goes bad!')
        //           console.log(error);
        //           res.json({err:"me cai al descargar la img min", dir:__dirname, error, body, response,archivoXml, imgNegocio});
        //         })
        //     );
        // });
    });
}
function crearPdf(req, res, negocioData) {
    console.log("entre a crear el pdf");
    let doc = new pdfkit_1.default({ margin: 50 });
    generateHeader(doc);
    generateCustomerInformation(doc);
    generateInvoiceTable(doc);
    doc.pipe(fs_1.default.createWriteStream(__dirname + '/../../temp/pdf/' + facturaGlobal._id + '.pdf'));
    doc.end();
    //sendEmail(res);
    buildJsonToXml(res, negocioData);
}
function generateHeader(doc) {
    doc
        .image(imgPathMin, 50, 45, { width: 120, height: 120 })
        .fillColor("#444444")
        .fontSize(18)
        .text(facturaGlobal.negocio.nombreNegocio, 200, 46)
        .fontSize(10)
        .text(`Teléfono: ${facturaGlobal.negocio.telefonoNegocio}`, 200, 71)
        .text(`Email: ${facturaGlobal.negocio.email}`, 200, 83)
        .text(`${facturaGlobal.negocio.direccion}`, 200, 95)
        .moveDown();
}
function generateCustomerInformation(doc) {
    doc
        .fontSize(9)
        .text(`Cliente: ${facturaGlobal.cliente.nombreUsuario}`, 380, 190)
        .text(`Cédula física: ${facturaGlobal.cliente.cedula}`, 380, 202)
        .text(`Contacto: ${facturaGlobal.cliente.email}`, 380, 214)
        .text('Teléfono: 26637902', 380, 226)
        .text('Número cliente: 123456789', 380, 238)
        .text("Consecutivo: 12345678909876", 50, 190)
        .text("Clave: 50614121800310274292600100001010000008893102465501", 50, 202)
        .text(`Fecha: ${dateformat_1.default(facturaGlobal.createAt, "dd-mm-yyyy h:MM TT")}`, 50, 214)
        .text("Fecha vencimiento: 30/3/2020", 50, 226)
        .text(`Condición de pago: ${facturaGlobal.condicionPago}`, 50, 238)
        .moveDown();
}
function generateInvoiceTable(doc) {
    doc
        .fontSize(14)
        .text('Factura Eléctronica', 50, 280);
    let i, invoiceTableTop = 290;
    const position = invoiceTableTop + (0 + 1) * 30;
    generateTableHeader(doc, position, "Descripción", "Cantidad", "Precio unitario", "Descuento", "Sub total", "Impuestos", "Total");
    for (i = 0; i < facturaGlobal.platillos.length; i++) {
        const platillo = facturaGlobal.platillos[i];
        const position = invoiceTableTop + (i + 1 + 1) * 30;
        const array = [
            platillo.cantidad,
            platillo.precio,
            platillo.descuento,
            platillo.subTotal,
            platillo.impuesto
        ];
        generateTableRow(doc, position, platillo.nombrePlatillo, array, platillo.total);
        if (i + 1 === facturaGlobal.platillos.length) {
            if (facturaGlobal.envio > 0) {
                const position = invoiceTableTop + ((i + 1) + 1 + 1) * 30;
                const array = [0, facturaGlobal.envio, 0, 0, 0];
                generateTableRowEnvio(doc, position, "Tasa del servicio de envio del pedido", array, facturaGlobal.envio);
                generateTotal(doc, position);
            }
            else {
                generateTotal(doc, position);
            }
        }
    }
}
function generateTableHeader(doc, y, c1, c2, c3, c4, c5, c6, c7) {
    doc
        .fontSize(8)
        .font('Helvetica-Bold').text(c1, 50, y)
        .font('Helvetica-Bold').text(c2, 250, y)
        .font('Helvetica-Bold').text(c3, 300, y)
        .font('Helvetica-Bold').text(c4, 370, y)
        .font('Helvetica-Bold').text(c5, 420, y)
        .font('Helvetica-Bold').text(c6, 470, y)
        .font('Helvetica-Bold').text(c7, 0, y, { align: "right" });
}
function generateTableRow(doc, y, c1, array, c7) {
    let finalArray = [278, 350, 403, 447, 505];
    for (let index = 0; index < array.length; index++) {
        console.log(array[index].toString().length);
        if (array[index].toString().length > 1 && array[index].toString().length < 4) {
            finalArray[index] = finalArray[index] - ((array[index].toString().length - 1) * 4);
            console.log(finalArray[index]);
        }
        else if (array[index].toString().length > 3) {
            finalArray[index] = finalArray[index] - ((array[index].toString().length - 1) * 4) - 4;
            console.log(finalArray[index]);
        }
    }
    doc
        .fontSize(8)
        .font('Helvetica').text(c1, 50, y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[0]), finalArray[0], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[1]), finalArray[1], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[2]), finalArray[2], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[3]), finalArray[3], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[4]), finalArray[4], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(c7), 0, y, { align: "right" });
}
function generateTableRowEnvio(doc, y, c1, array, c7) {
    let finalArray = [278, 350, 403, 447, 505];
    for (let index = 0; index < array.length; index++) {
        console.log(array[index].toString().length);
        if (array[index].toString().length > 1 && array[index].toString().length < 4) {
            finalArray[index] = finalArray[index] - ((array[index].toString().length - 1) * 4);
            console.log(finalArray[index]);
        }
        else if (array[index].toString().length > 3) {
            finalArray[index] = finalArray[index] - ((array[index].toString().length - 1) * 4) - 4;
            console.log(finalArray[index]);
        }
    }
    doc
        .fontSize(8)
        .font('Helvetica').text(c1, 50, y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[0]), finalArray[0], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[1]), finalArray[1], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[2]), finalArray[2], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[3]), finalArray[3], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(array[4]), finalArray[4], y)
        .font('Helvetica').text(new Intl.NumberFormat().format(c7), 0, y, { align: "right" });
}
function generateTotal(doc, y) {
    console.log("entre a crear la linea negra");
    y = y + 30;
    let imgLineaPath = __dirname + '/../../assets/images/linea-negra.jpg';
    let imgLineaMinPath = __dirname + '/../../assets/images/linea-negra-min.jpg';
    let imgCuadroPath = __dirname + '/../../assets/images/cuadro_negro.jpg';
    let imgCuadroObsPath = __dirname + '/../../assets/images/cuadrado_negro.jpg';
    let numLetras = convertir.NumerosALetras(facturaGlobal.totalFinal).split('Pesos');
    numLetras[1] = numLetras[1].slice(0, -4);
    console.log(numLetras[1]);
    const totalEnLetras = numLetras[0] + numLetras[1];
    doc
        .image(imgLineaPath, 50, y, { width: 515, height: 50 })
        .fontSize(8)
        .font('Helvetica-Bold').text('Monto en letras:', 50, y + 32)
        .font('Helvetica-Bold').text(totalEnLetras, 125, y + 32)
        .image(imgCuadroPath, 346, y + 45, { width: 220, height: 23 })
        .fontSize(10)
        .fillColor('white')
        .font('Helvetica-Bold').text("Montos totales", 420, y + 52)
        .fillColor('black')
        .fontSize(8)
        .text("Total Gravados ¢ :", 346, y + 78)
        .text(new Intl.NumberFormat().format(facturaGlobal.totalSinIva), 0, y + 78, { align: "right" })
        .image(imgLineaPath, 346, y + 86, { width: 220, height: 10 })
        .text("Total Exentos ¢ :", 346, y + 98)
        .text(new Intl.NumberFormat().format(0), 0, y + 98, { align: "right" })
        .image(imgLineaPath, 346, y + 106, { width: 220, height: 10 })
        .text("Total Venta ¢ :", 346, y + 118)
        .text(new Intl.NumberFormat().format(facturaGlobal.totalSinIva), 0, y + 118, { align: "right" })
        .image(imgLineaPath, 346, y + 126, { width: 220, height: 10 })
        .text("Total Descuento ¢ :", 346, y + 138)
        .text(new Intl.NumberFormat().format(0), 0, y + 138, { align: "right" })
        .image(imgLineaPath, 346, y + 146, { width: 220, height: 10 })
        .text("Total Venta Neta ¢ :", 346, y + 158)
        .text(new Intl.NumberFormat().format(facturaGlobal.totalSinIva), 0, y + 158, { align: "right" })
        .image(imgLineaPath, 346, y + 167, { width: 220, height: 10 })
        .text("Total Impuesto ¢ :", 346, y + 178)
        .text(new Intl.NumberFormat().format(facturaGlobal.totalSinIva * 0.13), 0, y + 178, { align: "right" })
        .image(imgLineaPath, 346, y + 186, { width: 220, height: 10 })
        .fontSize(9)
        .font('Helvetica-Bold')
        .text("Total Comprobante ¢ :", 346, y + 198)
        .text(new Intl.NumberFormat().format(facturaGlobal.totalFinal), 0, y + 198, { align: "right" })
        .image(imgLineaPath, 346, y + 208, { width: 220, height: 9 })
        .image(imgCuadroObsPath, 50, y + 70, { width: 275, height: 137 })
        .text("Observaciones", 146, y + 80)
        .fontSize(8)
        .font('Helvetica')
        .text("Tipo de cambio:", 65, y + 125)
        .text("1.00", 130, y + 125);
    generateFooter(doc, y);
}
function generateFooter(doc, y) {
    doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text("Autorizada mediante resolución No DGT-R-48-2016 del 7 de octubre de 2016", 50, y + 238, { align: "center", width: 500 })
        .font('Helvetica')
        .fontSize(7)
        .text("Comprobante electrónico emitido por Livereat", 50, y + 253, { align: "center", width: 500 })
        .fillColor('orange')
        .text("www.livereat.com", 50, y + 262, { align: "center", width: 500 });
}
function obtenerFacturas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        console.log(req.body);
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
                console.log('el token no coincide');
            }
            else {
                const facturas = yield factura_Model_1.default.find({ "cliente.idCliente": req.body.idCliente }).sort({ createAt: -1 });
                //primero creamos una factura
                //
                res.json({ res: 'facturas', facturas });
            }
        }));
    });
}
exports.obtenerFacturas = obtenerFacturas;
function buildJsonToXml(res, negocioData) {
    return __awaiter(this, void 0, void 0, function* () {
        /*LineaDetalle:[{
            NumeroLinea:1,
            Codigo:'',
            Cantidad:0,
            UnidadMedida:'',
            Descripcion:'',
            PrecioUnitario:0,
            SubTotal:0,
            Descuento:0,
            Impuesto:{
                Codigo:1,
                CodigoTarifa:1,
                Tarifa:1,
                Monto:1
            },
            ImpuestoNeto:1,
            MontoTotalLinea:1
        }]*/
        let LineaDetalle = [];
        for (let i = 0; i < facturaGlobal.platillos.length; i++) {
            const platillo = facturaGlobal.platillos[i];
            const payload = {
                NumeroLinea: i + 1,
                Codigo: i + 1,
                Cantidad: platillo.cantidad,
                Descripcion: platillo.nombrePlatillo,
                PrecioUnitario: platillo.precio,
                SubTotal: platillo.subTotal,
                Descuento: platillo.descuento,
                Impuesto: {
                    Codigo: 1,
                    Nombre: "IVA",
                    Tarifa: 0.13
                },
                ImpuestoNeto: platillo.impuesto,
                MontoTotalLinea: platillo.total
            };
            LineaDetalle.push(payload);
            if (i + 1 === facturaGlobal.platillos.length) {
                if (facturaGlobal.envio > 0) {
                    const payload = {
                        NumeroLinea: i + 2,
                        Codigo: 11111,
                        Cantidad: 1,
                        Descripcion: 'Tasa del servicio de envio del pedido',
                        PrecioUnitario: facturaGlobal.envio,
                        SubTotal: facturaGlobal.envio,
                        Descuento: 0,
                        Impuesto: {
                            Codigo: 1,
                            Nombre: 'IVA',
                            Tarifa: 0
                        },
                        ImpuestoNeto: 0,
                        MontoTotalLinea: facturaGlobal.envio
                    };
                    LineaDetalle.push(payload);
                }
            }
        }
        let factura = {
            Registro: {
                Clave: claveFactura,
                CodigoActividad: codigoActividad,
                NumeroConsecutivo: consecutivo.toString(),
                FechaEmision: new Date().toString()
            },
            Emisor: {
                CorreoElectronico: emailNegocio
            },
            Receptor: {
                Nombre: facturaGlobal.cliente.nombreUsuario,
                Identificacion: {
                    Tipo: 1,
                    Numero: facturaGlobal.cliente.cedula
                },
                NombreComercial: '',
                CorreoElectronico: facturaGlobal.cliente.email,
                ClienteExonerado: 0
            },
            MedioPago: {
                TipoPago: 1,
                DescripcionPago: 1
            },
            DetalleServicio: {
                LineaDetalle
            },
            ResumenFactura: {
                CodigoTipoMoneda: {
                    CodigoMoneda: 'CRC',
                    TipoCambio: 1
                },
                SubTotalGravado: facturaGlobal.totalSinIva,
                SubTotalExento: 0,
                Descuento: 0,
                TotalVentaNeta: 1,
                TotalIVA: facturaGlobal.totalSinIva * 0.13,
                PorcetajeExonerado: 0,
                TotalExonerado: 0,
                TotalComprobante: facturaGlobal.totalFinal
            },
            Firma: "",
            PublicKey: negocioData.publicKey
        };
        const payloadToFirm = {
            "PIN": negocioData.pinKey,
            "llave_privada": negocioData.privateKey,
            "clave_factura": claveFactura
        };
        request_1.default.post('http://104.248.58.128:7777/firmar', { json: payloadToFirm }, (error, response, body) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log("esta es la firma");
            factura.Firma = body.Firma;
            console.log("factura con la firma actualizada", factura);
            sendToXsd(res, factura);
        });
    });
}
function sendToXsd(res, factura) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("facturaxml", factura);
        request_1.default.post('http://localhost:3000/factura_electronica', { json: factura }, (error, response, body) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log(body);
            if (body.res === "Factura-procesada-correctamente") {
                let xml = body.xml;
                let xmlHacienda = body.acuseHacienda;
                var fs2 = require("fs");
                fs2.writeFile(__dirname + '/../../temp/xml/' + facturaGlobal._id + '.xml', xml, (err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Archivo guardado");
                    fs2.writeFile(__dirname + '/../../temp/xml/' + facturaGlobal._id + '.xml.xml', xmlHacienda, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("Archivo guardado");
                        sendEmail(res);
                        //validateXml(xml);
                    });
                });
            }
            else {
                res.json({ res: body });
            }
        });
    });
}
function sendEmail(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
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
        const htmlClient = `<div style="width: 85%; text-align: center; margin: auto;">
    <img style="width:120px; height:120px; margin: auto;"  src="${imgMinNegocio}" alt="">
    <br><br>
    <span style="font-size: 18px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #44d1ea;">
        ${nombreNegocio}
    </span>
    <br>
    <br>
    <div style="width: 90%; border-top: #595959 solid 1px; border-left: #595959 solid 1px; border-right: #595959 solid 1px; border-bottom: #595959 solid 1px; padding: 10px 10px 10px 10px; margin: auto;">
        <br>
        <span style="font-size: 18px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
            <span style="color: #2aa0b4;">Estimado(a) Cliente:</span>  ${nombreCliente}*
        </span>
        <p style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
            Adjunto encontrará su Factura Electrónica con número consecutivo <strong>00100001010000008893.</strong> 
        </p>
        <p style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
            Estos Documentos se encuentran disponibles en su formato XML y PDF en el sitio web <strong>www.livereat.com</strong>, para el cual le solicitamos registrarse.
        </p>
        <div style="width: 100%; text-align: center;">
            <span style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                <strong>Para nosotros es un placer servirle.</strong>
            </span>
        </div>
        
    </div>
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
        transporter.sendMail({
            from: 'Andrey Castillo <aocastillo@est.utn.ac.cr>',
            to: emailCliente,
            subject: `Factura Electrónica con número consecutivo ${facturaGlobal._id} del ${dateformat_1.default(facturaGlobal.createAt, "dd-mm-yyyy h:MM TT")} emitida por ${facturaGlobal.negocio.nombreNegocio} para ${facturaGlobal.cliente.nombreUsuario}*`,
            text: "Es un correo de prueba",
            html: htmlClient,
            attachments: [
                {
                    filename: facturaGlobal._id + '.pdf',
                    path: __dirname + '/../../temp/pdf/' + facturaGlobal._id + '.pdf'
                },
                {
                    filename: facturaGlobal._id + '.xml',
                    path: __dirname + '/../../temp/xml/' + facturaGlobal._id + '.xml'
                },
                {
                    filename: facturaGlobal._id + '.xml.xml',
                    path: __dirname + '/../../temp/xml/' + facturaGlobal._id + '.xml.xml'
                }
            ]
        }, (err, info) => {
            if (err) {
                console.log("hubo un error", err);
            }
            else {
                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
                transporter.close();
            }
        });
        sendEmailBusiness();
    });
}
function sendEmailBusiness() {
    const transporter = nodemailer_1.default.createTransport({
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
    const htmlBusiness = `<div style="width: 85%; text-align: center; margin: auto;" media="(min-width: 465px)">
    <img style="width:220px; height:90px; margin: auto;"  src="https://s3-us-west-1.amazonaws.com/livereat.app.com/livereat/logo.PNG" alt="">
    <br><br>
    <div style="width: 90%; border-top: #595959 solid 1px; border-left: #595959 solid 1px; border-right: #595959 solid 1px; border-bottom: #595959 solid 1px; padding: 10px 10px 10px 10px; margin: auto;">
        <br>
        <span style="font-size: 18px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
            <span style="color: #2aa0b4;">Estimado(a) Cliente:</span>  ${nombreNegocio}*
        </span>
        <p style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
            Adjunto encontrará su Factura Electrónica con número consecutivo <strong>00100001010000008893.</strong> 
        </p>
        <p style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
            Estos Documentos se encuentran disponibles en su formato XML y PDF en el sitio web <strong>www.livereat.com</strong>, para el cual le solicitamos registrarse.
        </p>
        <div style="width: 100%; text-align: center;">
            <span style="text-align: left !important; font-size: 14px; font-family: sans-serif; line-height: 20px; font-weight: 400; color: #595959;">
                <strong>Para nosotros es un placer servirle.</strong>
            </span>
        </div>
        
    </div>
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
    transporter.sendMail({
        from: 'Andrey Castillo <aocastillo@est.utn.ac.cr>',
        to: emailNegocio,
        subject: `Factura Electrónica con número consecutivo ${facturaGlobal._id} del ${dateformat_1.default(facturaGlobal.createAt, "dd-mm-yyyy h:MM TT")} emitida por ${facturaGlobal.negocio.nombreNegocio} para ${facturaGlobal.cliente.nombreUsuario}*`,
        text: "",
        html: htmlBusiness,
        attachments: [
            {
                filename: facturaGlobal._id + '.pdf',
                path: __dirname + '/../../temp/pdf/' + facturaGlobal._id + '.pdf'
            },
            {
                filename: facturaGlobal._id + '.xml',
                path: __dirname + '/../../temp/xml/' + facturaGlobal._id + '.xml'
            },
            {
                filename: facturaGlobal._id + '.xml.xml',
                path: __dirname + '/../../temp/xml/' + facturaGlobal._id + '.xml.xml'
            }
        ]
    }, (err, info) => {
        if (err) {
            console.log("hubo un error", err);
        }
        else {
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
            transporter.close();
        }
    });
}
