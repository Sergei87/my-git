
var player;
var stones; 
var field = document.getElementById('field');
var cents;
var columns  = [];;
var bombTimer ;
var bomb;
var door;
var colectedCoins = 0;
var level = 1;
var displayCoins = document.getElementById('displayCoins');
var displayLevel = document.getElementById('displayLevel');
var displayScore = document.getElementById('displayScore');
var scoreStorage = document.getElementById('scoreStorage');
var audio = document.getElementById('gameMusic');
displayLevel.innerHTML = 'Level ' + level;
displayCoins.innerHTML = '☺ = ' + colectedCoins;
var stonesCounter = 30;
var coinCounter = 10;
var timer;
var milliSec = 0;
var seconds = 0;
var minutes = 2;
var display = document.getElementById('displayTime');
display.innerHTML = ("0" + minutes + ":0" + seconds);	

var btnSound = document.getElementById('soundBtn');

window.addEventListener('load', function(){
	document.getElementById('mainMenu').style.transform = 'translateY(0px)';
	})

document.getElementById('start').addEventListener('click', startProgram);

setColoumnsOnPole();
playAudio();
btnSound.addEventListener('click', playAudio); 

// стартовая функция
function startProgram(){	
	document.getElementById('mainMenu').style.transform = 'translateY(860px)';	
	reverseTimer();
	audio.play();
	document.getElementById('start').blur();
	window.addEventListener('keydown', keyProgram);
	player = {top: 0, left: 0};
	bomb = {top: -50, left: -50}	
 	stones = [];
 	cents = [];	
	document.getElementById('id_player').style.left = player.left + 'px';
	document.getElementById('id_player').style.top = player.top + 'px';
	document.getElementById('id_player').style.display = 'block';	
	bombTimer = false;
	setStonesOnPole();	
	setCoin();
	setDoor();	
}

function keyProgram(e){
	// вверх
    if (e.keyCode == 38){
     	movePlayer(0, -50)
    }
	// вниз
    if (e.keyCode == 40){
    	movePlayer(0, 50)
    }
	// влево
    if (e.keyCode == 37){
    	movePlayer(-50, 0)
    }
	// вправо
    if (e.keyCode == 39){
    	movePlayer(50, 0)
    }
	// пробел 
    if (e.keyCode == 32 || e.charCode == 32){
     	if (bombTimer == false){
    		setBomb();
    	}
    }
}

function movePlayer(x, y){
	player.left = player.left + x;
	player.top = player.top + y;

	if( chekFreePlace() ){
		document.getElementById('id_player').style.left = player.left + 'px';
		document.getElementById('id_player').style.top = player.top + 'px';
	
		takeCoin();

		if (player.left == door.left) {
			if (player.top == door.top) {			 
					clearLevel();
					level++;
					displayLevel.innerHTML = 'Level ' + level;
					stonesCounter += 30;
					coinCounter += 3;
					seconds += 15;
					minutes += 2
					if (seconds >= 60) {
						minutes += 1
						seconds = 30;					
					}
					stopTimer();				
					startProgram(); 				
			}
		}
	} else {

		player.left = player.left - x;
		player.top = player.top - y;
	}
}
function setBomb(){

	bomb.left = player.left;
	bomb.top = player.top;

	document.getElementById('bombId').style.left = player.left + 'px';
	document.getElementById('bombId').style.top = player.top + 'px';
	document.getElementById('bombId').style.display = 'block';

	bombTimer = true;
	setTimeout(bum, 1500);
}
function bum (){
	var bombSound = document.getElementById("bombSound");
	bombSound.play();
	bombSound.volume = 0.5;

	document.getElementById('id_vzryv_horiz').style.left = (bomb.left - 50) + 'px';
	document.getElementById('id_vzryv_horiz').style.top = bomb.top + 'px';
	document.getElementById('id_vzryv_horiz').style.display = 'block';

	document.getElementById('id_vzryv_vert').style.left = bomb.left + 'px';
	document.getElementById('id_vzryv_vert').style.top = (bomb.top - 50) + "px";
	document.getElementById('id_vzryv_vert').style.display = 'block';

	setTimeout(afterExploseClear, 300);
}

function afterExploseClear(){
	bombTimer = false;
	document.getElementById('bombId').style.display = 'none';
	document.getElementById('id_vzryv_horiz').style.display = 'none';
	document.getElementById('id_vzryv_vert').style.display = 'none';
	for(x in stones){
		if(stones[x]['top'] < bomb.top + 51){
			if(stones[x]['top'] > bomb.top - 51){
				if(stones[x]['left'] == bomb.left){
					var stoneId = 'stones_' + parseInt(x);
					field.removeChild(document.getElementById(stoneId));
					stones[x]['top'] = -550;
				}
			}
		}
		if(stones[x]['left'] < bomb.left + 51){
			if(stones[x]['left'] > bomb.left - 51){
				if(stones[x]['top'] == bomb.top){
					stoneId = 'stones_' + parseInt(x);
					field.removeChild(document.getElementById(stoneId));
					stones[x]['left'] = -550;
				}
			}
		}
	}
	if(player.top < bomb.top + 51){
		if(player.top > bomb.top - 51){
			if(player.left == bomb.left){
				saveScore();
				gameOver();
				return;
			}
		}
	}
	if(player.left < bomb.left + 51){
		if(player.left > bomb.left - 51){
			if(player.top == bomb.top){
				saveScore();
				gameOver();	
				return;		
			}						
		}					
	}			
	bomb.left = -50 + 'px';
 	bomb.top = -50 + 'px';
}
function chekFreePlace(){
	if(player.left > 950){ return false }
	if(player.left < 0){ return false }
	if(player.top > 450){ return false }
	if(player.top < 0){ return false }
	if(bomb.top == player.top){
		if(bomb.left == player.left){
				return false;
		}
	}		
	for (x in stones) {
		if(stones[x]['top'] == player.top){
			if(stones[x]['left'] == player.left){
				return false;
			}
		}
	}	
	for (x in columns) {
		if(columns[x]['top'] == player.top){
			if(columns[x]['left'] == player.left){
				return false;
			}
		}
	}	
	return true
}	
function randomCoordinateX(){
	return parseInt(Math.random()*20)*50;		
}	
function randomCoordinateY(){
		return parseInt(Math.random()*10)*50;		
}	
function setStonesOnPole(){
	var randTop, randLeft;
	for (var i = 0; i < stonesCounter; i++) {
			var div = document.createElement('div');
			div.className = "stone";
			div.setAttribute('id', 'stones_' + i);
			field.appendChild(div);
			
			var a = {top: 0, left: 0}
			stones.push(a);
			randTop = randomCoordinateY();
			randLeft = randomCoordinateX();
			if (randTop < 100 && randLeft < 100) {
				randTop += 100;
			}
			stones[i]['top'] = randTop;
			stones[i]['left'] = randLeft;
			for (x in columns) {
				if(columns[x]['top'] == stones[0].top) {			
					if(columns[x]['left'] == stones[0].left) {
					 stones[0]['left'] = 900;					
					}
				}
			}
			var stoneId = 'stones_' + i;
			document.getElementById(stoneId).style.top = stones[i]['top'] + 'px';
			document.getElementById(stoneId).style.left = stones[i]['left'] + 'px';
			document.getElementById(stoneId).style.display = 'block';
		}
}
function setCoin() {
	for (var i = 0; i < coinCounter; i++) {
			var div = document.createElement('div');
			div.className = "coin";
			div.setAttribute('id', 'coinId_' + i);
			field.appendChild(div);			
			var centCord = {top: 0, left: 0}
			cents.push(centCord);
			cents[i]['top'] = stones[i+1]['top'];
			cents[i]['left'] = stones[i+1]['left'];		
			var centId = 'coinId_' + i;	
			document.getElementById(centId).style.top = cents[i]['top'] + 'px';
			document.getElementById(centId).style.left = cents[i]['left'] + 'px';
			document.getElementById(centId).style.display = 'block';	
	}
}
function takeCoin() {	
	for (x in cents) {
		if(cents[x]['top'] == player.top){
			if(cents[x]['left'] == player.left){
				var centId = 'coinId_' + parseInt(x);
				field.removeChild(document.getElementById(centId));
				cents[x]['top'] = -550;
				colectedCoins++;
				document.getElementById('displayCoins').innerHTML = '☺ = ' + colectedCoins;
			}
		}
	}
}
function setDoor(){
			var div = document.createElement('div');
			div.className = "door";
			div.setAttribute('id', 'door');
			field.appendChild(div);			
			door = {top: 0, left: 0};				
			door['top'] = stones[0]['top'];
			door['left'] = stones[0]['left'];				
			document.getElementById('door').style.top = stones[0]['top'] + 'px';
			document.getElementById('door').style.left = stones[0]['left'] + 'px';
}
function setColoumnsOnPole(){

	var randTop = 50;
	var randLeft = -50;
	var k=0, c=10;
for (var j = 0; j < 5; j++) {

	for (var i = k; i < c; i++) {
			var div = document.createElement('div');
			div.className = "column";
			div.setAttribute('id', 'column_' + i);
			field.appendChild(div);
			
			var a = {top: 0, left: 0}
			columns.push(a);					
			randLeft += 100;
			
			columns[i]['top'] = randTop;
			columns[i]['left'] = randLeft;

			var idColumn = 'column_' + i;
			document.getElementById(idColumn).style.top = randTop + 'px';
			document.getElementById(idColumn).style.left = randLeft + 'px';
			document.getElementById(idColumn).style.display = 'block';
			k++;
		}
		randTop +=100;
		randLeft = -50;
		c+=10;
	}
}
function playAudio() { 	
  var btnSound = document.getElementById('soundBtn'); 
  audio.volume = 0.5;
    if (audio.paused) {
       audio.play();
       btnSound.innerHTML = "♪Pause";
       btnSound.blur();
    } else {
    	audio.pause();	
			btnSound.innerHTML = "♪►Play";
			btnSound.blur();
		} 
}
function clearLevel() {
	var a = document.querySelectorAll('.stone'); 
	for (var i = 0; i < a.length; i++) {
		field.removeChild(a[i]);
	}
	a = document.querySelectorAll('.coin'); 
	for (var i = 0; i < a.length; i++) {
		field.removeChild(a[i]);
	}
	field.removeChild(document.getElementById('door'));
}
function gameOver() {
	stopTimer();
	audio.pause();
	window.removeEventListener('keydown', keyProgram);
	document.getElementById('id_player').style.display = 'none';
	document.getElementById('restartMenu').style.display = 'block';
	document.getElementById('mainMenu').style.transform = 'translateY(0px)';				
	clearLevel();

	displayScore.innerHTML = (displayLevel.innerHTML + '<br/>' + 'Colected Coins: ' + colectedCoins + '<br/>');

	level = 1;
	milliSec = 0;
	seconds = 0;
	minutes = 2;
	
	display.innerHTML = ("0" + minutes + ":0" + seconds);
	displayLevel.innerHTML = 'Level ' + level;
	colectedCoins = 0;
	document.getElementById('displayCoins').innerHTML = '☺ = ' + colectedCoins;	
	stonesCounter = 30;
	coinCounter = 10;
	var restartBtn = document.getElementById('restartBtn');
	restartBtn.onmouseup = startProgram; 			
	var cancelBtn = document.getElementById('cancelBtn');
	
	cancelBtn.onmouseup = function () {			
	 	document.getElementById('mainMenu').style.transform = 'translateY(-860px)';		 	
		setTimeout(function() {		
		document.getElementById('restartMenu').style.display = 'none';				
		document.getElementById('mainMenu').style.transform = 'translateY(0px)';		
		}, 1500);					
	}

}
function reverseTimer() {
    
    timer = setInterval(function(){    	
        var s , ms;

    	if (seconds >= 0 && milliSec == 0) {
    		seconds--;
    		milliSec = 1000;

    	    if (minutes != 0 && seconds < 0) {
    		minutes--;
    		seconds = 59;
            }
    	}
        milliSec -= 5;    	

        if (milliSec < 100) {            
            
            if (milliSec < 10) {
                ms =  ('00' + milliSec);
                // console.log(ms);
            } else  {
               ms =  ("0" + milliSec);
            }
        } else {ms = milliSec;}

        if (seconds  < 10) {
           s = ("0" + seconds);                  
        } else {s = seconds;}

        display.innerHTML = ("0" + minutes + ":" + s + "." + ms);

        if (minutes == 0 && seconds == 0 && milliSec == 0) {
            gameOver();
            clearInterval(timer); 
            display.innerHTML = ("0" + minutes + ":0" + seconds + ".00" + milliSec);
        }         
    }, 5);

    if (minutes <= 0 && seconds <= 0 && milliSec <= 0) {
    	gameOver();
    	clearInterval(timer);       
    } 
}

function stopTimer() {
    clearInterval(timer);
}
function saveScore() {
	
if (!window.localStorage.level) {
		window.localStorage.level = level;
	 } 
if (!window.localStorage.minutes) {
		window.localStorage.minutes = minutes;
	 } 
if (!window.localStorage.seconds) {
		window.localStorage.seconds = seconds;
	 } 
if (!window.localStorage.coins) {
		window.localStorage.coins = colectedCoins;					
	} 

 if (level == window.localStorage.level) {
 	if (colectedCoins > window.localStorage.coins) {
 		window.localStorage.coins = colectedCoins;
 	}
}
if (level > window.localStorage.level) { 	
 		window.localStorage.level = level;
 		window.localStorage.coins = colectedCoins; 
 	} 	
 	scoreStorage.innerHTML = ('HIGH SCORE:' + '<br/>' + 'Level: ' + window.localStorage.level + '<br/>' + 
														'Colected Coins: ' + window.localStorage.coins + '<br/>');
														
var clearScoreBtn = document.getElementById('clearScoreBtn');
	console.log(clearScoreBtn);
	clearScoreBtn.addEventListener('mouseup', function () {
	localStorage.clear();	
	scoreStorage.innerHTML = ('HIGH SCORE:' + '<br/>' + 'Level: ' + 1 + '<br/>' + 
														'Colected Coins: ' + 0 + '<br/>');
	})		
}