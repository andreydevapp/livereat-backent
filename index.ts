import Server from "./classes/server";
import cors from "cors";
//clientes
import authClient from "./routes/client/autenticacion";
import negocio from "./routes/client/negocios";
import platillosClient from "./routes/client/platilllos";
import pedidosClient from "./routes/client/pedidos";
import chatClient from "./routes/client/chat";

//negocios
import authNegocio from "./routes/admin/autenticacion";
import platillosAdmin from "./routes/admin/platillos";
import pedidosNegocio from "./routes/admin/pedidos";
import planes from "./routes/admin/planes";
import cantidades from "./routes/admin/cantidades";

//global
import chat from "./routes/global/chat";

//enviroments
import bodyParser from 'body-parser';

const server = Server.instance;

// BodyParser
server.app.use(cors());
server.app.use(function(req, res, next) {
    
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );

// CORS



// Rutas de servicios para el cliente
server.app.use('/',authClient);
server.app.use('/',negocio);
server.app.use('/',platillosClient);
server.app.use('/',pedidosClient);

// Rutas de servicios para el negocio
server.app.use('/',authNegocio);
server.app.use('/',platillosAdmin);
server.app.use('/',pedidosNegocio);
server.app.use('/',planes);
server.app.use('/',cantidades);

//Rutas globales
server.app.use('/',chat);

server.start( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});


