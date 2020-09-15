import {Router,Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import facturaModel from '../../modelAdmin/factura.Model';
import pdfkit from 'pdfkit';
import fs from 'fs';
//los estados de los pedidos
export async function obtenerPedidos(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token =  req.body.token;

    console.log(req.body);

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({res:'forbiden'});
            console.log('el token no coincide');
        }else{
            const pedidos:any = await facturaModel.find({idFactura:req.body.idFactura, "cliente.idCliente":req.body.idCliente, "negocio.idNegocio":req.body.idNegocio}).sort({createAt: -1});
            //devolvemos los platillos que tiene esa factura
            
            res.json({res:'pedidos',pedidos});
        }
    });   
}


//modifica el estado de los pedidos a vistos
export async function pedidosVistos(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token =  req.body.token;

    console.log(req.body);

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({res:'forbiden'});
            console.log('el token no coincide');
        }else{

            await facturaModel.updateOne({_id:req.body.idFactura,idNegocio:req.body.idNegocio}, {visto:true});

            const facturas:any = await facturaModel.find({"negocio.idNegocio":req.body.idNegocio}).sort({"visto.estado":1,createAt: -1});
            //primero creamos una factura
            //
            res.json({res:'facturas',facturas});

            console.log("entre a modificar el estado de las facturas");
            
            //devolvemos los platillos que tiene esa factura
        }
    });   
}

//los estados de los pedidos
export async function obtenerFacturas(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token =  req.body.token;

    console.log(req.body);

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({res:'forbiden'});
            console.log('el token no coincide');
        }else{

            const facturas:any = await facturaModel.find({"negocio.idNegocio":req.body.idNegocio}).sort({"visto.estado":1,createAt: -1});
            //primero creamos una factura
            //
            res.json({res:'facturas',facturas});
        }
    });
    
    
}

export async function obtenerNumFacturas(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token =  req.body.token;

    console.log(req.body);

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({res:'forbiden'});
            console.log('el token no coincide');
        }else{

            const cantiFacturas:any = await facturaModel.find({"negocio.idNegocio":req.body.idNegocio}).count();
            const noVistos:any = await facturaModel.find({"negocio.idNegocio":req.body.idNegocio,"visto.estado":false}).count();
            //primero creamos una factura
            //
            res.json({res:'facturas',cantidad:cantiFacturas,noVistos});
        }
    });
    
    
}

//modifica el estado de los pedidos a vistos
export async function modificarEstadoFactura(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token =  req.body.token;

    jwt.verify(token,'my_secret_token_Key',async (err:any,data:any)  =>{
        if (err) {
            res.json({res:'forbiden'});
            console.log('el token no coincide');
        }else{

            switch (req.body.opc) {
                case "visto":
                    console.log("entre a modificar el visto")
                    await facturaModel.update({_id:req.body.idFactura, "negocio.idNegocio":req.body.idNegocio,"cliente.idCliente": req.body.idCliente},
                    {
                        "visto.estado":true,
                        "visto.createAt":Date.now()
                    });
                break;
                case "aceptado":
                    await facturaModel.update({_id:req.body.idFactura, "negocio.idNegocio":req.body.idNegocio,"cliente.idCliente": req.body.idCliente},
                    {
                        "visto.estado":true,
                        "aceptado.estado":true,
                        "aceptado.createAt":Date.now()
                    });
                break;
                case "proceso":
                    await facturaModel.update({_id:req.body.idFactura, "negocio.idNegocio":req.body.idNegocio,"cliente.idCliente": req.body.idCliente},
                    {
                        "visto.estado":true,
                        "aceptado.estado":true, 
                        "enProceso.estado":true,
                        "enProceso.createAt":Date.now()
                    });
                break;
                case "enviado":
                    await facturaModel.update({_id:req.body.idFactura, "negocio.idNegocio":req.body.idNegocio,"cliente.idCliente": req.body.idCliente},
                    {
                        "visto.estado":true,
                        "aceptado.estado":true, 
                        "enProceso.estado":true,
                        "enviado.estado":true,
                        "enviado.createAt":Date.now()
                    });
                break; 
                case "entregado":
                    console.log("modificar",req.body.opc);
                    await facturaModel.update({_id:req.body.idFactura, "negocio.idNegocio":req.body.idNegocio,"cliente.idCliente": req.body.idCliente},
                    {
                        "visto.estado":true,
                        "aceptado.estado":true, 
                        "enProceso.estado":true,
                        "enviado.estado":true,
                        "entregado.estado":true,
                        "entregado.createAt":Date.now()
                    });
                break; 
                case "cancelado":
                    await facturaModel.update({idFactura:req.body.idFactura, "negocio.idNegocio":req.body.idNegocio,"cliente.idCliente": req.body.idCliente},
                    {
                        "cancelado.negocio":true,
                        "cancelado.estado":true,
                        "cancelado.createAt":Date.now()
                    });
                break;
                default:
                break;
              };

            const facturas:any = await facturaModel.find({idNegocio:req.body.idNegocio}).sort({visto:1,createAt: -1});

            res.json({res:'facturas',facturas});
            
            //devolvemos los platillos que tiene esa factura
        }
    });   
}


export async function pdf(req:Request, res:Response){

    console.log("entre a crear el pdf");

    const invoice = {
        shipping: {
          name: "John Doe",
          address: "1234 Main Street",
          city: "San Francisco",
          state: "CA",
          country: "US",
          postal_code: 94111
        },
        items: [
          {
            nombre: "Hamburgues de queso",
            cantidad:1,
            precio: 1200,
            descuento:0,
            totalSinIva: 34232,
            iva: 130,
            totalFinal: 37655.2
          },
          {
            nombre: "Hamburgues de queso",
            cantidad:1,
            precio: 1200,
            descuento:0,
            totalSinIva: 34232,
            iva: 130,
            totalFinal: 37655.2
          }
        ],
        subtotal: 8000,
        paid: 0,
        invoice_nr: 1234
      };

    let doc = new pdfkit({ margin: 50 });
    

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    await doc.pipe(fs.createWriteStream(__dirname + '../../../public/admin/pdf/idfactura2.pdf'));

    doc.end();

    res.json({res:"pdf creado"});

}

async function generateHeader(doc:any){
    const imgPath = __dirname + '../../../public/admin/imgPerfil/my-img-binary.bin' 
    doc
    .image(imgPath, 50, 45, { width: 120, height:120 })
    .fillColor("#444444")
    .fontSize(18)
    .text("Soda tey", 200, 46)
    .fontSize(10)
    .text(`Télefono: 26637902`, 200, 71)
    .text(`Email: andreyc0412@gmail.com`, 200, 83)
    .text(`Puntarenas, santa eduvijes, 200m oeste de la iglecia catolica`, 200, 95)
    
    
    .moveDown();

}

function generateCustomerInformation(doc:any, invoice:any) {
    const shipping = invoice.shipping;
  
    doc
      .fontSize(9)
      
      .text('Cliente: Andrey Castillo Duarte', 380, 190)
      .text('Cédula física: 604280241', 380, 202)
      .text('Contacto: ', 380, 214)
      .text('Teléfono: 26637902', 380, 226)
      .text('Número cliente: 123456789', 380, 238)

      .text("Consecutivo: 12345678909876", 50, 190)
      .text("Clave: 50614121800310274292600100001010000008893102465501", 50, 202)
      .text("Fecha: 25/3/2020 15:14", 50, 214)
      .text("Fecha vencimiento: 30/3/2020", 50, 226)
      .text("Condición de pago: Crédito", 50, 238)
      .moveDown();
}

function generateInvoiceTable(doc:any, invoice:any) {
    doc
    .fontSize(14)
    .text('Factura Eléctronica', 50, 280)
    let i,
    invoiceTableTop = 290;
    const position = invoiceTableTop + (0 + 1) * 30;
    generateTableHeader(
      doc,
      position,
      "Descripción",
      "Cantidad",
      "Precio unitario",
      "Descuento",
      "Sub total",
      "Impuestos",
      "Total"
    );

    for (i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1 + 1) * 30;
      generateTableRow(
        doc,
        position,
        item.nombre,
        item.cantidad,
        item.precio,
        item.descuento,
        item.totalSinIva,
        item.iva,
        item.totalFinal
      );
    }
}

function generateTableHeader(doc:any, y:any, c1:any, c2:any, c3:any, c4:any, c5:any, c6:any, c7:any) {
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

function generateTableRow(doc:any, y:any, c1:any, c2:any, c3:any, c4:any, c5:any, c6:any, c7:any) {
    doc
      .fontSize(7)
      .font('Helvetica-Bold').text(c1, 50, y)
      .font('Helvetica-Bold').text(c2, 275, y)
      .font('Helvetica-Bold').text(c3, 335, y)
      .font('Helvetica-Bold').text(c4, 405, y)
      .font('Helvetica-Bold').text(c5, 432, y)
      .font('Helvetica-Bold').text(c6, 495, y)
      .font('Helvetica-Bold').text(c7, 0, y, { align: "right" });
}

function generateFooter(doc:any) {
    doc
      .fontSize(10)
      .text(
        "El pago vence dentro de los 15 días. Gracias por hacer negocios.",
        50,
        410,
        { align: "center", width: 500 }
      );
}