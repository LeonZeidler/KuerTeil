
// initialiere benötigte Globale variablen
var Life= 3;
var hit;  // boolean wird target berührt
var registered; // boolean wurde target bereits ausgewertet
var multiplier = 1.0;
var punkte = 0;
var combo = 0;
// Materialien für Spielerobjekt
const cubeGeometry = new THREE.BoxGeometry(3,0.5,1); 
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 'pink'
});
// Materialien für ZielObjekte
const sphereRadius = 2.5;
const sphereWidthSegments = 32;
const sphereHeightSegments = 16;
const sphereGeometry = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthSegments,
    sphereHeightSegments
);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 'tan',

});


/*
    Update Funktion- bewegt ziele und wertet Treffer aus

    beginnt mit der Arbeit wenn ein Target den Spieler passiert.
    Wenn der Spieler das target berührt hatte bevor es ihn passiert wird das Ziel als getroffen gewertet.
    Es werden punkte vergeben die zuvor mit dem Aktuelle modifikator multipliziert werden(standard 100 pkt x 1.0 mod)
    Anschließend werden der combo-zähler um 1, und der Multiplikator um 0.1 erhöht. 
    danach wird es als registriert gesetzt um das mehrfache vergeben von punkten zu verhindern

    Hat der Spieler das Ziel nicht berührt wird es als verfehlt gewertet .
    Der spieler erhält keine Punkte und der modifikator sowie der Combozähler werden auf standard zurück gesetzt, außerdem
    verliert der spieler ein Leben
    Danach wird das ziel als registriert gesetzt um zu verhindern das der Spieler mehr als ein Leben verliert.


    Sobald das ziel sich hinter der Kamera befindet werden zwei  zufallszahlen gewürfelt. Die Erste bestimmt die neue horizontale
    Position des Ziels und die Zweite die neue Vertikale Position des Ziels.
    (Horizontale und Vertikale Position sind begrenzt um ein Faires Spiel zu gewährleisten)

    Danach wird das Ziel an den Horizont bewegt um den Prozess von Vorne zu beginnen

*/
function update(target){
    if(target.position.z<=30){
        target.position.z += 0.2;

        if(target.position.z>10 ){
            if(hit ==false &&registered==false){
                multiplier = 1.0;
                combo =0;
                Life -= 1 ;
                registered=true;
            }else if(hit == true && registered == false){
                multiplier += 0.1;
                punkte += 100*multiplier;
                combo +=1;
                registered=true;
                hit = false;
            }   
        }
    }else{
            var posx;
            var x = Math.floor(Math.random()*11);
            switch (x) {
                case 0:
                    posx= -15;
                    break;
                case 1:
                    posx= -12;
                    break;
                case 2:
                    posx= -9;
                    break;
                case 3:
                    posx=-6;
                    break;
                case 4:
                    posx= -3;
                    break;
                case 5:
                    posx= 0;
                    break;
                case 6:
                    posx= 3;
                    break;    
                case 7:
                    posx= 6;
                    break;
                case 8:
                    posx= 9;
                    break;
                case 9:
                    posx= 12;
                    break;            
                case 10:
                    posx= 15;
                    break;
            }
            
            var posy;
            var y = Math.floor(Math.random()*5)
            switch (y) {
                case 0:
                    posy =2.5;
                    break;
                case 1:
                    posy =4;
                    break;
                case 2:
                    posy =5.5;
                    break;
                case 3:
                    posy = 7;
                    break;
                case 4:
                    posy =9.5;
                    break;
                default:
                    break;
            }

            target.position.set(posx , posy , -60);

            registered = false;
            hit= false;
        }
}
/*
Shadow Setup

Erstellt ein Directionallight und richtet den Schattenbereich so aus, dass alle Ziele und der Spieler einen Schatten werfen können

*/
function shadowsetup(scene){
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow =true;
directionalLight.position.set(0,30,-5);
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -40;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
scene.add(directionalLight);
}

/* 
funKtion für hitdetection

prüft ob die Boundingboxen des Spielers die eines ziels berührt und setzt den Hit-boolean auf true
*/
function hitdetect(Alice, Bob) {
    if (Alice.intersectsSphere(Bob)==true){
        hit= true;
        return true;
    }else{
        return false;
    }
}
// updatet die Statistik Anzeige mit den aktuellen Werten
function updateStats(){
    var pnt = document.getElementById("points");
    var mlt = document.getElementById("multiplikator");
    var cmb = document.getElementById("combo");
    var lfe = document.getElementById("life");
    pnt.innerHTML = "Punkte: "+Math.floor(punkte);
    mlt.innerHTML = "Multiplikator: "+ multiplier.toFixed(1)+" x";
    cmb.innerHTML = "Combo: " + combo;
    lfe.innerHTML = "Leben: " + Life;
}

/*
Gegenwirkung zur Rotation durch die Steuerung

Prüft die aktuelle Rotationsausrichtung des Flugzeugs und reagiert entsprechend

wenn der spieler nach links zeigt, wird nach rechts gedreht bis neutral
wenn der Spieler nach oben zeigt, wird nach unten gedreht usw.
*/
function rotationUpdate(player){
    if (player.rotation.x>0){
        player.rotation.x -= 0.01;
    }else if(player.rotation.x<0){
        player.rotation.x +=0.01;
    }

    if(player.rotation.z>0){
        player.rotation.z -= 0.01;
    }else if(player.rotation.z<0){
        player.rotation.z += 0.01;
    }

}

// Blendet den game-over Screen ein und gibt die finale Punktzahl aus
function gameOver(){
    var goString =" Du Hast Verloren! </br> Deine erreichten Punkte: </br> "+ Math.floor(punkte)+"</br> Gut gespielt!";

    var gameOver = document.getElementById("gameOver");
    gameOver.style.display="block";
    gameOver.innerHTML = goString;
}