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
const mensajes_Model_1 = __importDefault(require("../../modelGlobal/mensajes.Model"));
const chats_Model_1 = __importDefault(require("../../modelGlobal/chats.Model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
            }
            else {
                console.log("entre a get chat");
                const id = req.body.id;
                console.log(id);
                const chats = yield chats_Model_1.default.find({ chatCon: id }).sort({ createAt: 1 });
                res.json(chats);
            }
        }));
    });
}
exports.getChat = getChat;
function getMensajesSinVer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log(id);
        const chat = yield chats_Model_1.default.find({ chatCon: id }).limit(1);
        console.log(chat);
        console.log(chat[0].mensajesSinVer);
        res.json({ res: chat[0].mensajesSinVer });
    });
}
exports.getMensajesSinVer = getMensajesSinVer;
function modificarMensajesSinVer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        console.log("si entre");
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
            }
            else {
                console.log("modificar mensajes sin ver");
                //myId
                const myId = req.body.myId;
                //otherId
                const otherId = req.body.otherId;
                //sumamos la cantidad de mensajes sin ever del otro usuario en el chatModel
                const chatUser = yield chats_Model_1.default.find({ idUser: otherId, chatCon: myId });
                chatUser[0].mensajesSinVer = 0;
                yield chats_Model_1.default.update({ idUser: otherId, chatCon: myId }, {
                    mensajesSinVer: chatUser[0].mensajesSinVer
                });
                res.json({ res: "Datos modificados" });
            }
        }));
    });
}
exports.modificarMensajesSinVer = modificarMensajesSinVer;
function getMensajes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const token = req.body.token;
        console.log("si entre");
        jsonwebtoken_1.default.verify(token, 'my_secret_token_Key', (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({ res: 'forbiden' });
            }
            else {
                console.log("entre a obtener los mensajaes");
                const chats = yield mensajes_Model_1.default.find({ idUser: req.body.myId, chatCon: req.body.otherId }).sort({ createAt: 1 });
                res.json(chats);
            }
        }));
    });
}
exports.getMensajes = getMensajes;
