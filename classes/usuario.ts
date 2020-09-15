

export class Usuario {

    public id: string;
    public userId: string;
    public nombre: string;
    public imagenPerfil: string;
    public sala: string;
    public tipoUsuario: string;
    

    constructor( id: string ) { 
        
        this.id = id;
        this.userId = 'sin-id';
        this.nombre = 'sin-nombre';
        this.sala   = 'sin-sala';
        this.imagenPerfil = 'sin-foto';
        this.tipoUsuario = 'sin-tipo';

    }

}