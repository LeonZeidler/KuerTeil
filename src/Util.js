
//Target update Function zählt auch die punkte
var Life= 3;
var hit ;
var registered;
var multiplier = 1.0;
var punkte = 0;
var combo = 0;
// Materialien für Spielerposition
const cubeGeometry = new THREE.BoxGeometry(3,0.5,1); 
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 'pink'
});




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
//Shadow Setup
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

// function für hitdetection
function hitdetect(Alice, Bob) {
    if (Alice.intersectsSphere(Bob)==true){
        hit= true;
        return true;
    }else{
        return false;
    }
}

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


function gameOver(){
    var goString =" Du Hast Verloren! </br> Deine erreichten Punkte: </br> "+ Math.floor(punkte)+"</br> Gut gespielt!";

    var gameOver = document.getElementById("gameOver");
    gameOver.style.display="block";
    gameOver.innerHTML = goString;
}