	//import * as $ from "jquery";
	///<reference path="node_modules\@types\jquery\JQuery.d.ts" />
	console.log("TS POKEMON V0.0.1 LOADED!");
	
	class Mapa {
		columnes: number;
		files: number;
		idContenedor: string;
		
		constructor(
			idCon: string,
			columns: number, 
			fils: number
		){
			this.idContenedor = idCon;
			this.columnes = columns;
			this.files = fils;
			
			let tabla = "<table>";
			
			
			for(let cols = 0; cols < this.columnes; cols++){
				tabla += "<tr>";
				for(let fils = 0; fils < this.files; fils++){
					let id = cols.toString()+""+fils.toString();
					tabla += "<td id=\""+id+"\"></td>";
				}
				tabla += "</tr>";
			}
			
			tabla += "</table>";
			
			$("#"+this.idContenedor).html(tabla);
		}
	}
	
	
	

	class Pokemon {
		static GLOBAL_ID: number = 1;
		static SOCIEDAD: [Pokemon];
		static MAPA: [[number, number]];
		
		id: number;
		fullName: string;
		
		generacion: number;
		clase: string;
		fuerte: string;
        debil: string;
        sexo: string;
		velocidad: number;
		
		dias: number;
		salud: number = 0;
		vivo: boolean = false;
		
		posX: number;
		posY: number;
		
		posicion: [ number, number ];
		vida: number = 0;
		
		
		constructor(
			nombre: string, 
			sex: string, 
			gen: number, 
			clase: string,
			fila: number,
			columna: number,
		) 
		{
			this.id = Pokemon.GLOBAL_ID++;
			this.sexo = sex;
			this.dias = 1;
			this.generacion = gen;
			this.clase = clase;
			this.posX = fila;
			this.posY = columna;
            this.posicion = [this.posX, this.posY];
            this.fullName = this.id.toString() + this.clase + "_" + this.generacion.toString() + this.sexo;
			
			
			switch(this.clase) {
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
			
			let mapId = this.posX+""+this.posY;
			$("#"+mapId).addClass(this.clase);
			this.habla("nacer", "");
		}
		
		habla(mssg: string, name: string){
			switch(mssg) {
				case "nacer": { 
					console.log(this.fullName+" acaba de nacer");
					break;
				}
				case "reproducir": { 
					console.log(this.fullName+" acaba de dar a luz a " + name);
					break;
				}
				case "atacar": { 
					console.log(this.fullName+" acaba de atacar a " + name);
					break;
				}
				case "morir": { 
					console.log(this.fullName+" acaba de morir");
					break;
				}
				
				default:{
					console.log(this);
					break;
				}
			}            
		}

		//devuelve los pokemon de un determinado posicion del mapa
		getOtro(posicion: [number, number]) { 
            
            return null;
        }
        
		//empieza el intervalo de 'vida'
		vive(){
            this.vivo = true;
            let me = this;
			this.vida = window.setInterval(function(){
                //me.habla();
                me.dias++;
				let otro: any = me.getOtro(me.posicion);
				if(otro !== null){
					me.socializar(otro);
				}
				
				if(me.vida < 1){
					me.muere();
					
				} else {
					me.muevete();
				}
				
			}, (me.velocidad));	
		}
		
		//movimiento aleatorio
		muevete(){
			let randPos = Math.floor(Math.random() * 4) + 1;
			switch(randPos) {
				case 1: { 
					//UP
					if(this.posX > 0){
						this.posX--;
					} else {
						this.muevete();
					}					
					break; 
				} 
				case 2: { 
					//DOWN
					if(this.posX < 124){
						this.posX++;
					} else {
						this.muevete();
					}
					break; 
				} 
				case 3: { 
					//LEFT
					if(this.posY > 0){
						this.posY--;
					} else {
						this.muevete();
					}
					break; 
				} 
				case 4: { 
					//RIGHT
					if(this.posY < 124){
						this.posY++;
					} else {
						this.muevete();
					}
					break; 
				} 
		}
		
		//Daña o recibe daño de otro Pokemon
		lucha(otro: Pokemon){
			if(otro.debil === this.clase){
				this.vida -= 50;				
			} else {
				otro.vida -= 50;
				this.habla("atacar", otro.fullName);
			}
		}
		
		//crea un nuevo pokemon. solo se ejecuta si els pokemon es hembra
		reproducir(otro: Pokemon){
			
			let randomsexo = Math.round(Math.random()) > 0 ? "M" : "H";
			
			let neonato = new Pokemon(
				"nombre", 
				randomsexo, 
				this.generacion++, 
				this.clase, 
				this.posX, 
				this.posY
			);
			
			this.habla("reproducir", neonato.fullName);
		}
		
		//define la relacion con otros pokemon
		socializar(otro: Pokemon){
			if(otro.clase === this.clase){
				if(otro.sexo !== this.sexo){
					if(this.sexo = "F"){
						//this.reproducir(otro);
					} else {
						this.vida += 10;
						otro.vida += 10;
					}
				}
			} else {
				this.lucha(otro);
			}
		}
		
		//para el intervalo de 'vida'
		muere(){
			this.vivo = false;
            let me = this;
			clearInterval(me.vida);
			this.habla("morir","");
		}
	}

	interface Poke {
		clase: string;
		nombre: string;
		sexo: string;
		
		posX: number;
		posY: number;
    }

	