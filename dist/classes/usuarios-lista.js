"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsuariosLista {
    constructor() {
        this.lista = [];
    }
    // Agregar un usuario
    agregar(usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }
    // Agregar un usuario
    agregarNegocio(usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }
    actualizarNombre(id, newId, nombre, pathImg, opc) {
        for (let usuario of this.lista) {
            if (usuario.id === id) {
                usuario.userId = newId;
                usuario.nombre = nombre;
                usuario.imagenPerfil = pathImg;
                usuario.tipoUsuario = opc;
                break;
            }
        }
        console.log('===== Actualizando usuario ====');
        console.log(this.lista);
    }
    actualizarFotoDeperfil(id, imgPath) {
        for (let usuario of this.lista) {
            if (usuario.userId === id) {
                usuario.imagenPerfil = imgPath;
                break;
            }
        }
        console.log('===== Actualizando imegen de perfil del usuario ====');
        console.log(this.lista);
    }
    // Obtener lista de usuarios
    getLista() {
        return this.lista.filter(usuario => usuario.nombre !== 'sin-nombre');
    }
    // Obtener un usuario por el id del socket
    getUsuario(id) {
        return this.lista.find(usuario => usuario.id === id);
    }
    //obtener un usuario por el id del User
    getUsuarioByIdUser(id) {
        return new Promise(resolve => {
            resolve(this.lista.find(usuario => usuario.userId === id));
        });
    }
    // Obtener usuario en una sala en particular
    getUsuariosEnSala(sala) {
        return this.lista.filter(usuario => usuario.sala === sala);
    }
    // Borrar Usuario
    borrarUsuario(id) {
        const tempUsuario = this.getUsuario(id);
        this.lista = this.lista.filter(usuario => usuario.id !== id);
        return tempUsuario;
    }
}
exports.UsuariosLista = UsuariosLista;
