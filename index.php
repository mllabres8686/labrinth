<?php
set_time_limit(10);
$start = time();

$x = 9;
$y = 9;
?>

<html>
<head>

<meta charset="utf-8">
<title>HTML5</title>

<script src="./JS/jquery-1.12.3.min.js"></script>

<script src="./JS/pokemon_orig.js"></script>

<link rel="stylesheet" href="./css/styles.css">

<script>
	var autonum = 0;
	var pokemons=[];
	var stop = false;
	//mides del taulell
	var max_w = 450;
	var max_h = 450;
	
	//numero de cel.les
	var map_w = 9;
	var map_h = 9;
	
	//numero de cel.les
	var json_w = 9;
	var json_h = 9;
	
	//mida de les cel.les
	var cell_w = Math.round(max_w/map_w) - 3;
	var cell_h = Math.round(max_h/map_h);
	
	//posicio cella seleccionada
	var selected_cell_row = null;
	var selected_cell_col = null;
	
	//recorregut del poke
	var pix = cell_h;
	//marge del pokemon
	var margin = (pix - 21)/2;
	
	//objecte $ del mapa
	var map_table = null;
	
	var json_map = [];
	
	
	//construeix el mapa
	function map_maker(){
		map_table = $("#map table");
		
		
		for(var roww = 0 ; roww < map_h ; roww++){
			map_table.append("<tr></tr>")
			json_map.push(new Array());
			for(var coll = 0 ; coll < map_w ; coll++){
				map_table.find("tr").last().append("<td></td>");
				var cell = {
					dirs:new Array()
				}
				json_map[roww].push(cell);
			}
		}
		$("td").css({"width":cell_w+"px","height":cell_h+"px"});
		console.log(json_map);
	}
	
	function json_map_maker(){
		map_table = $("#map table");
		$("td").css({"width":cell_w+"px","height":cell_h+"px"});
		
		for(var roww = 0 ; roww < json_h ; roww++){
			map_table.append("<tr></tr>")
			for(var coll = 0 ; coll < json_w ; coll++){
				map_table.find("tr").last().append("<td id='"+""+roww+"-"+coll+""+"'></td>");
				var selected_cell = $("#map table").find("tr:nth-child("+(roww+1)+")").find("td:nth-child("+(coll+1)+")");
				
				if(jQuery.inArray("1", json_map[roww][coll].dirs) !== -1){
					selected_cell.addClass("up");
				}
				if(jQuery.inArray("2", json_map[roww][coll].dirs) !== -1){
					selected_cell.addClass("right");
				}
				if(jQuery.inArray("3", json_map[roww][coll].dirs) !== -1){
					selected_cell.addClass("down");
				}
				if(jQuery.inArray("4", json_map[roww][coll].dirs) !== -1){
					selected_cell.addClass("left");
				}
				
				if (json_map[roww][coll].hasOwnProperty("start")) {
					selected_cell.addClass("start");
					pokemon_start = {"x":roww, "y":coll};
				}
				
				if (json_map[roww][coll].hasOwnProperty("finish")) {
					selected_cell.addClass("finish");
					pokemon_target = {"x":roww, "y":coll};
				}
			}
		}
		
		$("td").css({"width":cell_w+"px","height":cell_h+"px"});
		
	}
	
	
	$(document).ready(function(){
		console.log("document ready");
		
		$.getJSON('laberynth_1.json', function (json) {
			console.log(json);
			var map_json = json;
			json_map = json;
			json_map_maker();
		}).fail(function(){
			map_maker();
		}).always(function(){
			pokemons.splice(pokemons.length, 0, new Pokemon(pokemon_start.x, pokemon_start.y, "P0H",json_map));
		});
		
		
		//velocitat de la partida
		$(document).on('change', '#slider_speed',function(){
			console.log($("#slider_speed").val());
			$.each(pokemons, function(index, value) {
				value.sleep();
				value.vel_mov = parseFloat(value.orig_vel)*parseFloat($("#slider_speed").val());
				value.vive();
			});
		});
		
		//al fer click a un cel·la tots els pokemons tenen akesta cel·la com a target
		$(document).on('click', '#map td', function(event){
			console.log("TD clicked");
			$("#map td").removeClass("selected");
			$(this).addClass("selected");
			var col = $(this).parent().children().index($(this));
			var row = $(this).parent().parent().children().index($(this).parent());
			
			selected_cell_row = row;
			selected_cell_col = col;
			
			console.log("TD clicked ROW:"+selected_cell_row+" COL:"+selected_cell_col);
			
			$("#current_lab_butt p:first").html("fila: "+row+" columna: "+col);
			
			//localStorage.setItem('myObj', JSON.stringify(json_map));
			//var obj2 = JSON.parse(localStorage.getItem('myObj'));
		});
		
		//al fer click a un cel·la tots els pokemons tenen akesta cel·la com a target
		$(document).on('click', '#lab_butt button', function(event){
			console.log("BUTTON clicked");
			var butt_class = $(this).attr("class");
			butt_class = butt_class.substring(1, butt_class.length);
			
			json_map[selected_cell_row][selected_cell_col].dirs = new Array();
			
			var selected_cell = $("#map table").find("tr:nth-child("+(selected_cell_row+1)+")").find("td:nth-child("+(selected_cell_col+1)+")");
			
			if (butt_class.indexOf("1") >= 0){
				json_map[selected_cell_row][selected_cell_col].dirs.push("1");
				selected_cell.addClass("up");
			}
			if (butt_class.indexOf("2") >= 0){
				json_map[selected_cell_row][selected_cell_col].dirs.push("2");
				selected_cell.addClass("right");
			}
			if (butt_class.indexOf("3") >= 0){
				json_map[selected_cell_row][selected_cell_col].dirs.push("3");
				selected_cell.addClass("down");
			}
			if (butt_class.indexOf("4") >= 0){
				json_map[selected_cell_row][selected_cell_col].dirs.push("4");
				selected_cell.addClass("left");
			}
			selected_cell.addClass("completed");
			
			localStorage.setItem('myObj', JSON.stringify(json_map));
			var obj2 = JSON.parse(localStorage.getItem('myObj'));
			
			
			console.log(json_map);
		});
		
		
	});
	
	
	function startStop(){
		if(stop === true){
			$.each(pokemons, function(index, value) {
				value.vive();
			});
			stop = false;
		} else {
			$.each(pokemons, function(index, value) {
				value.sleep();
			});
			stop = true;
		}
	};
	
	
	function restart(){
		console.log("START GAME");
		
		if(Array.isArray(pokemons) && pokemons.length > 0 ){
			$.each(pokemons, function(index, value) {
				value.muere();
			});
			pokemons = [];
			$("#bichos").empty();
			$(".ring").empty();
			$("td").removeClass();
		}
		for(var ii = 0 ; ii < clases.length; ii++){
			var current_class = clases[ii];
			for(var i = 0 ; i < (numParelles * 2) ; i++){
				var sexo = "M";
				if(gender_bool){
					var sexo = "H";
					gender_bool = false;
				} else {
					gender_bool = true;
				}
				if(clases.indexOf("planta") !== -1){
					pokemons.splice(pokemons.length, 0, new Pokemon(
						Math.floor(Math.random() * ((map_w - 2) - 1 + 1)) + 1, 
						Math.floor(Math.random() * ((map_w - 2) - 1 + 1)) + 1, 
						"P"+autonum+sexo, current_class, sexo
					));
				}
			}
		}
		
			
		$.each(pokemons, function(index, value) {
			value.vive();
		});
		
		startMonitoring();
	}
	
</script>

</head>
  <body>
	<!-- ELEMENTS FLOTANTS-->
	<div id="bichos"></div>
	
	<!-- MAPA o TAULELL -->
	<div class="container">
		<div id="map">
			<table>
			
				<?php
				/*
					for($yy = 0 ; $yy < $y ; $yy++){
						echo "<tr>";
						for($xx = 0 ; $xx < $x ; $xx++){
							echo "<td id='".$yy."-".$xx."'></td>";
						}
						echo "</tr>";
					}
					*/
				?>
			</table>
		</div>
	</div>


	<div id="info">
		<!-- BOTONS I SLIDERS -->
		<nav>
			<button onclick="startStop()">start/stop</button>
			<button onclick="restart()">restart</button>
			<label for="slider_speed">velocitat</label>
			<input type="range" min="0.05" max="4.95" value="1" step="0.05" class="slider" id="slider_speed">
		</nav>
		<div>
			<p>
				<button onclick="startCell()">Inici</button>
				<button onclick="endCell()">Final</button>
			</p>
			<div id="lab_butt">
				<p>
					<button class="c1"></button>
					<button class="c2"></button>
					<button class="c3"></button>
					<button class="c4"></button>
				</p>
				<p>
					<button class="c12"></button>
					<button class="c23"></button>
					<button class="c34"></button>
					<button class="c14"></button>
				</p>
				<p>
					
					
					<button class="c124"></button>
					<button class="c123"></button>
					<button class="c234"></button>
					<button class="c134"></button>
					
				</p>
				
				<p>
					
					<button class="c13"></button>
					<button class="c24"></button>
					<button class="c1234"></button>
				</p>
			</div>
			<div id="current_lab_butt">
				<p></p>
				<p></p>
			</div>
		</div>
	</div>
   
	
    <footer>
      &copy; 2017 Miquel Llabrés. All rights reserved.
    </footer>
	
  </body>
</html>
