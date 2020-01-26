

export class Usuario {

    public id: string;
    public userId: string;
    public nombre: string;
    public imgenPerfil: string;
    public sala: string;
    public tipoUsuario: string;
    

    constructor( id: string ) { 
        
        this.id = id;
        this.userId = 'sin-id';
        this.nombre = 'sin-nombre';
        this.sala   = 'sin-sala';
        this.imgenPerfil = 'sin-foto';
        this.tipoUsuario = 'sin-tipo';

    }

}