import { Usuario } from './usuario';


export class UsuariosLista {

    private lista: Usuario[] = [];


    constructor() { }

    // Agregar un usuario
    public agregar( usuario: Usuario ) {

        this.lista.push( usuario );
        console.log( this.lista );
        return usuario
    }

    // Agregar un usuario
    public agregarNegocio( usuario: Usuario ) {

        this.lista.push( usuario );
        console.log( this.lista );
        return usuario
    }

    public actualizarNombre( id: string,newId:string, nombre: string, pathImg: string, opc: string ) {

        for( let usuario of this.lista ) {
            if ( usuario.id === id ) {
                usuario.userId = newId;
                usuario.nombre = nombre;
                usuario.imagenPerfil = pathImg;
                usuario.tipoUsuario = opc;
                break;
            }

        }

        console.log('===== Actualizando usuario ====');
        console.log( this.lista );

    }

    public actualizarFotoDeperfil( id: string,imgPath: string ) {
        for( let usuario of this.lista ) {

            if (usuario.userId === id) {
                usuario.imagenPerfil = imgPath;
                break;
            }

        }

        console.log('===== Actualizando imegen de perfil del usuario ====');
        console.log( this.lista );

    }

    

    // Obtener lista de usuarios
    public getLista() {
        return this.lista.filter( usuario => usuario.nombre !== 'sin-nombre' );
    }

    // Obtener un usuario por el id del socket
    public getUsuario( id: string ) {
        return this.lista.find( usuario => usuario.id === id );
    } 

    //obtener un usuario por el id del User
    public getUsuarioByIdUser( id: string ) {
        return new Promise(resolve => {
            resolve(this.lista.find( usuario => usuario.userId === id ));
        });
    }

    // Obtener usuario en una sala en particular
    public getUsuariosEnSala( sala: string ) {

        return this.lista.filter( usuario =>usuario.sala === sala );

    }

    // Borrar Usuario
    public borrarUsuario( id: string ) {

        const tempUsuario = this.getUsuario( id );

        this.lista = this.lista.filter( usuario => usuario.id !== id );

        return tempUsuario;
        
    }


} 