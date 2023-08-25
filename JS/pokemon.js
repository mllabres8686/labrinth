//import * as $ from "jquery";
///<reference path="node_modules\@types\jquery\JQuery.d.ts" />
console.log("TS POKEMON V0.0.1 LOADED!");
var pokeMap = null;
var Mapa = /** @class */ (function () {
	private idContenedor: String;
	var columnes: Number;
	var files: Number;
    function Mapa(idCon:String, columns:Number, fils:Number) {
        idContenedor = idCon;
        columnes = columns;
        files = fils;
        var tabla = "<table>";
        for (var cols = 0; cols < ts.columnes; cols++) {
            tabla += "<tr>";
            for (var fils_1 = 0; fils_1 < files; fils_1++) {
                var id = cols.toString() + "" + fils_1.toString();
                tabla += "<td id=\"" + id + "\"></td>";
            }
            tabla += "</tr>";
        }
        tabla += "</table>";
        $("#" + idContenedor).html(tabla);
    }
	pokeMap = Mapa;
    return Mapa;
}());
var Pokemon = /** @class */ (function () {
    function Pokemon(this: any, nombre:String, sex:String, gen:Number, clase:String, fila:Number, columna:Number) {
        this.salud = 0;
        this.vivo = false;
        this.vida = 0;
        this.id = Pokemon.GLOBAL_ID++;
        this.sexo = sex;
        this.dias = 1;
        this.generacion = gen;
        this.clase = clase;
        this.posX = fila;
        this.posY = columna;
        this.posicion = [this.posX, this.posY];
        this.fullName = this.id.toString() + this.clase + "_" + this.generacion.toString() + this.sexo;
        switch (this.clase) {
            case "azul": {
                this.velocidad = 1200;
                this.salud = 1200;
                this.debil = "verde";
                this.fuerte = "fuego";
                this.vive();
                break;
            }
            case "rojo": {
                this.velocidad = 850;
                this.salud = 850;
                this.debil = "azul";
                this.fuerte = "verde";
                this.vive();
                break;
            }
            case "verde": {
                this.velocidad = 1000;
                this.salud = 1000;
                this.debil = "fuego";
                this.fuerte = "azul";
                this.vive();
                break;
            }
            default: {
                this.velocidad = 1000;
                this.vida = 1000;
                this.debil = "fuego";
                this.fuerte = "azul";
                this.vive();
                break;
            }
        }
        var mapId = this.posX + "" + this.posY;
        $("#" + mapId).addClass(this.clase);
        this.habla("nacer", "");
    }
	Pokemon.prototype.habla = function (mssg: String, name:String) {
        switch (mssg) {
            case "nacer": {
                console.log(this.fullName + " acaba de nacer");
                break;
            }
            case "reproducir": {
                console.log(this.fullName + " acaba de dar a luz a " + name);
                break;
            }
            case "atacar": {
                console.log(this.fullName + " acaba de atacar a " + name);
                break;
            }
            case "morir": {
                console.log(this.fullName + " acaba de morir");
                break;
            }
            default: {
                console.log(this);
                break;
            }
        }
    };
    //devuelve los pokemon de un determinado posicion del mapa
    Pokemon.prototype.getOtro = function (posicion:any) {
        return null;
    };
    //empieza el intervalo de 'vida'
    Pokemon.prototype.vive = function () {
        this.vivo = true;
        var me = this;
        this.vida = window.setInterval(function () {
            //me.habla();
            me.dias++;
            var otro = me.getOtro(me.posicion);
            if (otro !== null) {
                me.socializar(otro);
            }
            if (me.vida < 1) {
                me.muere();
            }
            else {
                me.muevete();
            }
        }, (me.velocidad));
    };
    //movimiento aleatorio
    Pokemon.prototype.muevete = function () {
        var randPos = Math.floor(Math.random() * 4) + 1;
        console.log(randPos);
    };
    //Daña o recibe daño de otro Pokemon
    Pokemon.prototype.lucha = function (otro:any) {
        if (otro.debil === this.clase) {
            this.vida -= 50;
        }
        else {
            otro.vida -= 50;
            this.habla("atacar", otro.fullName);
        }
    };
    //crea un nuevo pokemon. solo se ejecuta si els pokemon es hembra
    Pokemon.prototype.reproducir = function (otro:any) {
        var randomsexo = Math.round(Math.random()) > 0 ? "M" : "H";
        var neonato = new (Pokemon as any)("nombre", randomsexo, this.generacion++, this.clase, this.posX, this.posY);
        this.habla("reproducir", neonato.fullName);
    };
    //define la relacion con otros pokemon
    Pokemon.prototype.socializar = function (otro:any) {
        if (otro.clase === this.clase) {
            if (otro.sexo !== this.sexo) {
                if (this.sexo = "F") {
                    //this.reproducir(otro);
                }
                else {
                    this.vida += 10;
                    otro.vida += 10;
                }
            }
        }
        else {
            this.lucha(otro);
        }
    };
    //para el intervalo de 'vida'
    Pokemon.prototype.muere = function () {
        this.vivo = false;
        var me = this;
        clearInterval(me.vida);
        this.habla("morir", "");
    };
    Pokemon.GLOBAL_ID = 1;
    return Pokemon;
}());
