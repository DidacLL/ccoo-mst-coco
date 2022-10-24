// ### VARIABLES ###

// Array de palabras
var palabras = [["barcelo", "Presidente y vicepresidenta de MST. Padre e hija. Una misma cosa, un mismo apellido"],
  ["patronal", "Dentro del sector Contact Center, la asociación CEX, es la…"],
  ["cgt", "Compañeros/as de trabajo y delegadas sindicales que ahora representan a la empresa en puestod como coordinación, planificación, RRHH"],
  ["bajamedica", "El despido por bajo rendimiento en MST, en la mayoría de casos en realidad es por la…"],
  ["convenio", "Lleva 3 años caducado pero en ultraactividad, la Patronal pone palos en las ruedas y entorpece las negociaciones. Casi no ha habido avances en el futuro…"],
 ];
// Palabra a averiguar
var palabra = "";
// Nº aleatorio
var rand;
// Palabra oculta
var oculta = [];
// Elemento html de la palabra
var hueco = document.getElementById("palabra");
// Contador de intentos
var cont = 6;
// Botones de letras
var buttons = document.getElementsByClassName('letra');
// Boton de reset
var btnInicio = document.getElementById("reset");


// ### FUNCIONES ###

// Escoger palabra al azar
function generaPalabra() {
  rand = (Math.random() * Math.max(0,palabras.length-1)).toFixed(0);
  palabra = palabras[rand][0].toUpperCase();
  console.log(palabra);
}

// Funcion para pintar los guiones de la palabra
function pintarGuiones(num) {
  for (var i = 0; i < num; i++) {
    oculta[i] = "_";
  }
  hueco.innerHTML = oculta.join("");
}

//Generar abecedario
function generaABC (a,z) {
  document.getElementById("abcdario").innerHTML = "";
  let i = a.charCodeAt(0), j = z.charCodeAt(0);
  let letra = "";
  for( ; i<=j; i++) {
    letra = String.fromCharCode(i).toUpperCase();
    document.getElementById("abcdario").innerHTML += "<button class= 'keyboard-btn' value='" + letra + "' onclick='intento(\"" + letra + "\")' class='letra' id='"+letra+"'>" + letra + "</button>";
    if(i===110) {
      document.getElementById("abcdario").innerHTML += "<button class= 'keyboard-btn' value='Ñ' onclick='intento(\"Ñ\")' class='letra' id='"+letra+"'>Ñ</button>";
    }
  }
}

// Chequear intento
function intento(letra) {
  document.getElementById(letra).disabled = true;
  if(palabra.indexOf(letra)!== -1) {
    for(var i=0; i<palabra.length; i++) {
      if(palabra[i]===letra) oculta[i] = letra;
    }
    hueco.innerHTML = oculta.join("");
    document.getElementById("acierto").innerHTML = "Bien!";
    document.getElementById("acierto").className += "acierto verde";
  }else{
    cont--;
    document.getElementById("intentos").innerHTML = cont;
    document.getElementById("acierto").innerHTML = "Fallo!";
    document.getElementById("acierto").className += "acierto rojo";
    document.getElementById("image").src="dist/img/ahorcado_"+cont+".png";
    
  }
  compruebaFin();
  setTimeout(function () { 
    document.getElementById("acierto").className = ""; 
  }, 800);
}

// Obtener pista
function pista() {
  document.getElementById("hueco-pista").innerHTML = palabras[rand][1];
}

// Compruba si ha finalizado
function compruebaFin() {
  if( oculta.indexOf("_") === -1 ) {
    document.getElementById("msg-final").innerHTML = "Felicidades !!";
    document.getElementById("msg-final").className += "zoom-in";
    document.getElementById("palabra").className += " encuadre";
    document.getElementById("hueco-pista").innerHTML = "";
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
    document.getElementById("reset").innerHTML = "Empezar";
    btnInicio.onclick = function() { location.reload() };
  }else if( cont === 0 ) {
    document.getElementById("msg-final").innerHTML = "Game Over";
    document.getElementById("msg-final").className += "zoom-in";
    for (let j = 0; j < buttons.length; j++) {
      buttons[j].disabled = true;
    }
    setTimeout(function () {
      location.reload();
    }, 2000);
  }
}
document.onkeydown = function(evt) {
  let charCode = evt.code;
  console.log(charCode);
  var charStr = charCode.charAt(charCode.length-1);
  document.getElementById(charStr).click();
};


// Restablecer juego
function start() {
  generaPalabra();
  pintarGuiones(palabra.length);
  generaABC("a","z");
  cont = 6;
  document.getElementById("intentos").innerHTML=cont;
}

// Iniciar
window.onload = start();
