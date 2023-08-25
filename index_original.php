<?php
set_time_limit(10);
$start = time();
/*
for ($i = 0; $i < 9; ++$i) {
    echo microtime(true)."<br/>";
	
    time_sleep_until($start + $i + 1);
}
*/

$x = 5;
$y = 5;
?>
<html>
<head>

<meta charset="utf-8">
<title>HTML5</title>

<script src="./JS/jquery-1.12.3.min.js"></script>
<script src="./JS/pokemon_orig.js"></script>

<script>
	var pokemons=[];
	var stop = false;


	$(document).ready(function(){
		
		//pokemons.splice(pokemons.length, 0, new Pokemon(0, 0, "P1M", "planta", "M"));
		pokemons.splice(pokemons.length, 0, new Pokemon(0, 4, "P0H", "planta", "H"));
		//pokemons.splice(pokemons.length, 0, new Pokemon(8, 4, "F1M", "fuego", "M"));
		//pokemons.splice(pokemons.length, 0, new Pokemon(2, 4, "F1H", "fuego", "H"));
		//pokemons.splice(pokemons.length, 0, new Pokemon(9, 3, "A1M", "agua", "M"));
		//pokemons.splice(pokemons.length, 0, new Pokemon(3, 2, "A2H", "agua", "H"));

		
			
		$.each(pokemons, function(index, value) {
			value.move();
		});
		

	});
	
	function startStop(){
		if(stop === true){
			$.each(pokemons, function(index, value) {
				value.move();
			});
			stop = false;
		} else {
			$.each(pokemons, function(index, value) {
				value.muere();
			});
			stop = true;
		}
	};
	
	function restart(){
		$.each(pokemons, function(index, value) {
			value.muere();
		});
		
		pokemons = [];
		
		$("#bichos").empty();
		
		//pokemons.splice(pokemons.length, 0, new Pokemon(0, 0, "P1M", "planta", "M"));
		pokemons.splice(pokemons.length, 0, new Pokemon(0, 4, "P0H", "planta", "H"));
		//pokemons.splice(pokemons.length, 0, new Pokemon(8, 4, "F1M", "fuego", "M"));
		pokemons.splice(pokemons.length, 0, new Pokemon(2, 4, "F1H", "fuego", "H"));
		//pokemons.splice(pokemons.length, 0, new Pokemon(9, 3, "A1M", "agua", "M"));
		pokemons.splice(pokemons.length, 0, new Pokemon(3, 2, "A2H", "agua", "H"));
	}

	
	//$(document).off("").on("")

</script>
<style>
	table{
		table-layout: fixed;
		border-collapse: collapse;
	}
	td{
		border: 1px solid #adadad;
		width: 17px;
		height:20px;
	}
	.fuego{
		background-color:red;
		
	}
	.agua{
		background-color:blue;
		
	}
	.planta{
		
		background-color:green;
		
	}
	.poke{
		position: absolute;
		width:21px;
		height:21px;
		
		font-size:9px;
		font-family:fantasy;
		text-align:center;
		line-height:22px;
		
		border-radius:50px;
		box-shadow:inset 0 0 1px 1px white;
	}
	.ring{
		position:absolute;
		top: 0;
		left: 0;
		width:21px;
		height:21px;
		border-radius:100px;
		border:1px solid gold;
	}
</style>
</head>
  <body>
	<div id="bichos"></div>
	<div class="ring"></div>
    <header>
      <h1>H1</h1>
    </header>
   
	<nav>
		<button onclick="startStop()">start/stop</button>
		<button onclick="restart()">restart</button>
	</nav>
	
	<section class="container">
	
		<table>
			<?php
				for($yy = 0 ; $yy < $y ; $yy++){
					echo "<tr>";
					for($xx = 0 ; $xx < $x ; $xx++){
						echo "<td id='".$yy."-".$xx."'></td>";
					}
					echo "</tr>";
				}
			?>
		</table>
		
	</section>

   
	
    <footer>
      <p>&copy; 2017 Miquel Llabrés. All rights reserved.</p>
    </footer>
	
  </body>
</html>
