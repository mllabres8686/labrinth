	function Pokemon(xx ,yy, divv, lab){
		this.nombre = divv;
		this.id = divv;
		//tots els pokemons vius
		this.vive_f = null;
	
		//this.power = 0;
		this.x=xx;
		this.y=yy;
		
		this.selected = false;
		this.target = null;
		
		this.direction = "NONE";
		
		//this.vel_mov = (300* parseFloat($("#slider_speed").val()));
		this.vel_mov = 1200;
		
		this.tremox = {
			"laberynth": lab,
			"bifurcations": new Array(),
			"preferent_dirs":new Array(),
			"final_target":pokemon_target,
			"temp_target":null,
			"last_target":null,
			"last_cell":null,
			"banned": new Array()
		}
		
		$("body #bichos").prepend("<div id='"+divv+"' class='poke ' style='margin:"+margin+";'></div>");
		
		$("#"+divv).css($("#"+xx+"-"+yy+"").offset());
		
		console.log(divv+"  está vivo!");
		console.log(this);
		
		//calcula la/les direccions preferents a l'hora d'escollir casella
		this.getPreferents = function(){
			var t = this;
			//comparar con target y extraer preferentes
			var dif_x = t.tremox.final_target.x - t.x;
			var dif_y = t.tremox.final_target.y - t.y;
			var pref_dirs = new Array();
			
			if(dif_y < 0){
				//dalt
				pref_dirs.push("1");
			} else if(dif_y > 0){
				//baix
				pref_dirs.push("3");
			}
			
			if(dif_x > 0){
				//dreta
				pref_dirs.push("2");
			} else if(dif_x < 0){
				//esquerre
				pref_dirs.push("4");
			}
			
			t.tremox.preferent_dirs = pref_dirs;
			
			
		}
		
		//trasnforma un un numero en una cel·la
		this.numbToCell = function(numb){
			var t = this;
			var curr_cell = null;
			switch(numb) {
				case '1':
					curr_cell = {'x':(t.x-1),'y':(t.y)}
				break;
				case '2':
					curr_cell = {'x':(t.x),'y':(t.y+1)}
				break;
				case '3':
					curr_cell = {'x':(t.x+1),'y':(t.y)}
				break;
				case '4':
					curr_cell = {'x':(t.x),'y':(t.y-1)}
				break;
			}
			return curr_cell;
		}
		
		this.chooseDirection = function(chosen_dir){
			var t = this;
			console.log(chosen_dir);
			
			//no se li pasa cap direccio
			if(chosen_dir === null || chosen_dir == undefined || chosen_dir == "undefined"){
				console.log("direction is null");
				
				//totes les direccions disponibles
				var cell_dirs = t.tremox.laberynth[t.x][t.y].dirs;
				//les direccions que tenim desprñes de treure les banned
				var posible_dirs = new Array();
				
				//
				
				//recorre totes les direccions de la casella
				for(var pref = 0; pref < cell_dirs.length ; pref++ ){
					var curr_dir = cell_dirs[pref];
					var curr_cell = t.numbToCell(curr_dir);
					
					console.log("¿¿IS BANNED??");
					console.log(t.tremox.banned);
					console.log(curr_cell);
					console.log(t.tremox.banned.indexOf(curr_cell));
					console.log(t.tremox.banned.includes(curr_cell));
					
					
					for(var bann = 0; bann < t.tremox.banned.length ; bann++ ){
						if(JSON.stringify(t.tremox.banned[bann]) === JSON.stringify(curr_cell)){
							// alert("FOUND!!");
						}
					}
					
						
					if(t.tremox.banned.indexOf(curr_cell) === -1 ){
						
						//i les compara amb les preferides
						if(t.tremox.preferent_dirs.includes(curr_dir)){
							console.log(curr_dir + " is preferent");
							
							
							//var curr_cell = t.numbToCell(curr_dir);
							
							/*
							console.log("COMPARATION");
							console.log(t.tremox.banned[0]);
							console.log(curr_cell);
							
							// Find if the array contains an object by comparing the property value
							var someOver18 = t.tremox.banned.some(myFunction);
							
							function myFunction(value, index, array) {
							  return value.x !== curr_cell.x && value.y !== curr_cell.y;
							}
							
							console.log("someOver18" + someOver18);
							*/
						} else {
							console.log(curr_dir + " is NOT in array");
						}
						
					} else {
						console.log("IS BANNED");
						console.log(t.tremox.banned);
						console.log(curr_dir);
						console.log(t.tremox.banned.indexOf(curr_dir));
					}
				}
				
				console.log("posible dirs "+posible_dirs.join());
				
				if(posible_dirs.length == 0){
					chosen_dir = t.tremox.laberynth[t.x][t.y].dirs[(Math.random()*t.tremox.laberynth[t.x][t.y].dirs.length)|0];
				} else if(posible_dirs.length == 1){
					chosen_dir = posible_dirs[0];
				} else {
					chosen_dir = posible_dirs[(Math.random()*posible_dirs.length)|0];
				}
			} 
			
			var new_targ = t.numbToCell(chosen_dir);
			
			t.assignTarget(new_targ);
		}
		
		//tremox
		//on estic
		//quines caselles anexes te la casella actualment
		//trasformar els numeros de la casella an coordenades
		//a quines d'aqueste caselles ja he estat
		//la ultima casella on he estat
		this.tremoxMove = function(){
			console.log("--------------------");
			console.log("TREMOX MOVE");
			var t = this;
			var cell_dirs = t.tremox.laberynth[t.x][t.y].dirs;
			//donde estoy
			console.log("Estoy en X:"+t.y+" Y:"+t.x);
			console.log("en esta casilla estan disponibles las direcciones "+cell_dirs.join());
			
			t.getPreferents();
			
			
			
			//Tipo de casilla:
			//sin salida
			//pasadizo
			//bifurcacion
			if(cell_dirs.length === 1){
				console.log("Es callejon sin salida");
				//sin salida
				//torar enrere fins l'ultima bifurcació(guardada a last_target)
				//marcar aquest camí com invàlid (totes les caselles a benned fins arribar a bifurcació)
				
				
				t.target = t.tremox.temp_target;
				t.tremox.banned.push({x:t.x,y:t.y});
				
				$("#"+t.x+"-"+(t.y)+"").addClass("banned");
				
				//t.chooseDirection(cell_dirs[0]);
				
				var new_targ = t.numbToCell(cell_dirs[0]);
				
				t.assignTarget(new_targ);
				
				
			}else if(cell_dirs.length === 2){
				console.log("Es pasadizo");
				//pasadizo
				//busca les direccions disponibles a la casella del laberint
				//descarta la posicion anterior (last_cell)
				//va a la unica direccio disponible
				t.chooseDirection();
				
			} else if(cell_dirs.length > 2){
				console.log("Es bifurcacion");
				//es bifurcacion
				//guardar ultima bifurcacion
				t.tremox.temp_target = {"x":t.x,"y":t.y};
				//guardar datos bifurcacion
				//decidir el camí i guardarlo
				t.tremox.bifurcations.push(t.tremox.laberynth[t.x][t.y]);
				// y direccion tomada
				
				//elegir camino segun preferentes
				
				t.chooseDirection();
				
			}else{
				//camina
			}
			t.tremox.last_cell = {"x":t.x,"y":t.y};
			
			//seguir camino hsta final o proxima bifurcacion o sin salida
			console.log("--------------------");
		}
		
		
		//funcio que anima al poke d'una casella a una altre
		this.targetMove = function(){
			var t = this;
			console.log("--------------------");
			console.log("TARGET MOVE");
			console.log(t.target);
			if(!t.targetIsNull()){
				var target_x = t.target.x;
				var target_y = t.target.y;
				
				if(target_x > -1 && target_y > -1 && t.x > -1 && t.y > -1){
					var dif_x = 0;
					var dif_y = 0;
					
					dif_x = Math.abs(target_x - t.x);
					dif_y = Math.abs(target_y - t.y);
					
					if(dif_x > 0 || dif_y > 0){
						//mes diferencia vertical
						if(dif_x > dif_y){
							//BAIX
							if(target_x > t.x){
								t.direction = "DOWN";
								$("#"+divv).css({'background-position-y': '0px'});
								$("#"+divv)
								.animate(
									{'top': '+='+pix+'px'},
									t.vel_mov*0.2, 
									"linear",
									function(){
										t.x++;
										if(t.x === target_x && t.y === target_y){
											t.emptyTarget();
										}
										t.pintaPosibles();
									}
								);
							//DALT
							} else if(target_x < t.x){
								t.direction = "UP";
								$("#"+divv).css({'background-position-y': '-48px'});
								$("#"+divv)
								.animate(
									{'top': '-='+pix+'px'},
									t.vel_mov*0.2, 
									"linear", 
									function(){
										t.x--;
										if(t.x === target_x && t.y === target_y){
											t.emptyTarget();
										}
										t.pintaPosibles();
									}
								);
							}
						//mes diferencia horitzontal
						} else {
							//DRETA
							if(target_y > t.y){
								t.direction = "RIGHT";
								$("#"+divv).css({'background-position-y': '-32px'});
								$("#"+divv)
								.animate(
									{'left': '+='+pix+'px'},
									t.vel_mov*0.2, 
									"linear", 
									function(){
										t.y++;
										if(t.x === target_x && t.y === target_y){
											t.emptyTarget();
										}
										t.pintaPosibles();
									}
								);
							//ESQUERRE
							} else if(target_y < t.y){
								t.direction = "LEFT";
								$("#"+divv).css({'background-position-y': '-16px'});
								$("#"+divv)
								.animate(
									{'left': '-='+pix+'px'}, 
									t.vel_mov*0.2, 
									"linear", 
									function(){
										t.y--;
										if(t.x === target_x && t.y === target_y){
											t.emptyTarget();
										}
										t.pintaPosibles();
									}
								);
							}
						}
					} else {
						t.emptyTarget();
					}
				} else {
					t.emptyTarget();
				}
			}
			console.log("--------------------");
			
			
		}
		
		
		//tasques d'actualització de variables
		this.tareasDiarias = function(){
			
			var t = this;
			
			//envia les dades a la interficie visualitzadora
			if(t.selected === true){
				$("#"+t.id).addClass("selected");
				t.print();
				
			} else {
				const realCopy = { ...t };
				$("#"+t.id).removeClass("selected");
			}
			
		}
		
		
		//el cicle vital de cada bitxo
		this.vive = function (){
			var t = this;
			console.log(divv+"  se mueve!");
			t.vive_f = setInterval(function(){
				
				console.log(" ");
				console.log(" ");
				console.log(" ");
				
				//decideix la casella
				t.tremoxMove();
				
				//animacio de moviment
				t.targetMove();
				
				t.tareasDiarias();
			}, (t.vel_mov));
		};
		
		
		//pinta caselles posibles i preferents
		this.pintaPosibles = function(){
			var t = this;
			
			//visualitza les direccions preferents
			$("#map td").removeClass("prefered-v prefered-h");
			for(var pref = 0; pref < t.tremox.preferent_dirs.length ; pref++ ){
				switch(t.tremox.preferent_dirs[pref]) {
					case '1':
						$("#"+t.x+"-"+(t.y-1)+"").addClass("prefered-v");
					break;
					case '2':
						$("#"+(t.x+1)+"-"+t.y+"").addClass("prefered-h");
					break;
					case '3':
						$("#"+t.x+"-"+(t.y+1)+"").addClass("prefered-v");
					break;
					case '4':
						$("#"+(t.x-1)+"-"+t.y+"").addClass("prefered-h");
					break;
				}
			}
			
			//marca la casella com visitada
			$("#"+t.x+"-"+t.y+"").addClass("visited");
			
			//marca caseles possibles
			$("#map td").removeClass("posible");
			console.log("----posibles actuals----");
			console.log(t.tremox.laberynth[t.x][t.y].dirs.join());
			console.log("------------------------");
			for(var i = 0 ; i < t.tremox.laberynth[t.x][t.y].dirs.length ; i++){
				console.log("switcing "+t.tremox.laberynth[t.x][t.y].dirs[i]);
				switch(t.tremox.laberynth[t.x][t.y].dirs[i]) {
					case '1':
						$("#"+(t.x-1)+"-"+t.y+"").addClass("posible");
					break;
					case '2':
						$("#"+t.x+"-"+(t.y+1)+"").addClass("posible");
					break;
					case '3':
						$("#"+(t.x+1)+"-"+t.y+"").addClass("posible");
					break;
					case '4':
						$("#"+t.x+"-"+(t.y-1)+"").addClass("posible");
					break;
				}
			}
		}
		
		
		//nomes adorm un bitxo
		this.sleep = function(){
			var t = this;
			clearInterval(t.vive_f);
			//console.log(t.nombre +" duerme");
		};
		
		
		//calcula distancia entre dos bitxos
		this.calculaDistancia = function(otro){
			var t = this;
			var distancia = Math.abs(t.x - otro.x) + Math.abs(t.y - otro.y);
			return distancia;
		}
		
		
		///////////////////////
		//FUNCIONES DE TARGET//
		///////////////////////
		
		this.emptyTarget = function(){
			var t = this;
			t.target = null;
			t.modo = "RANDOM";
		}
		
		this.assignTarget = function(otro){
			var t = this;
			t.target = otro;
		}
		
		this.targetIsNull = function(){
			var t = this;
			var returnable = true;
			if(t.target === null || t.target === undefined || t.target === 'undefined'){
				returnable = true;
			} else {
				returnable = false;
			}
			return returnable;
		}
		
		///////////////////////
		//FUNCIONS GENÈRIQUES//
		///////////////////////
		
		//retorna al grafic dades concretes
		this.print = function(){
			var t = this;
			const realCopy = { ...t };
			var data = {
				"ID":realCopy.nombre,
				"TARGET":(realCopy.target === null)?null:
					{
						"ID":realCopy.target.nombre,
						"X":realCopy.target.x,
						"Y":realCopy.target.y
					},
				"X":realCopy.x,
				"Y":realCopy.y,
				"MODO":realCopy.modo,
				"MOTIVACION":realCopy.motivacion,
				"GENERO":realCopy.sexo,
				"DIAS":realCopy.dias,
				"MAX_VIDA":realCopy.max_vida,
				"VIDA":realCopy.vida,
				"VELOCIDAD":realCopy.vel_mov,
				"FAMILIA":t.familia.length,
				"SOCIEDAD":t.society.length
			};

			var obj = JSON.stringify(data,null, 4);
			$("#poke_info").html("<pre>"+obj+"</pre>");
		}
		
		
		//escolta si es fa click a sobre d'un bitxo
		$("#"+divv).click({poke: this}, function(event){
			var t = this;
			for(var pok = 0 ; pok < pokemons.length; pok++){
				pokemons[pok].selected=false;
			}
			event.data.poke.selected = true;
			event.data.poke.print();
		});
	}