


//Renderer setup
const renderer = new THREE.WebGLRenderer({antialas: true});
renderer.setClearColor(new THREE.Color(0xb0e0e6));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);


/*
Scene setup

Nebel setup - soll den "pop-in"-Effekt der Zielringe am Horizont verstecken
*/
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xffffff, 15, 115);

//Grundbeleuchtung
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

//Funktion zum Setup für den Schattenwurf
shadowsetup(scene);

//Kamera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / innerHeight, 0.1, 100);
camera.position.y = 13;
camera.position.z = 28;
camera.position.x = 0;


//loader setup
const textureLoader = new THREE.TextureLoader();
const modelLoader =new THREE.OBJLoader();
const modelMTLLoader= new THREE.MTLLoader();


// Bodentextur-und Material
const groundTex = textureLoader.load('../textures/Ground.jpg');
groundTex.wrapS = THREE.RepeatWrapping;
groundTex.wrapT = THREE.RepeatWrapping;
groundTex.repeat.set(5,3);
const bodenGeometry = new THREE.CylinderGeometry(100,100,120,40);
const bodenMaterial = new THREE.MeshStandardMaterial({
    map: groundTex 

});
/*
Boden

Der Boden ist ein auf der Seite liegender Zylinder der sich rückwärts dreht.
mit entsprechender Kamerapositionierung, soll dadurch der Eindruck einer Vorwärtsbewegung enstehen, obwohl die Kamera still steht.
*/
const boden = new THREE.Mesh(bodenGeometry, bodenMaterial);
scene.add(boden);
boden.position.y = -102;
boden.position.z = -30;
boden.rotation.z = 1.5 * Math.PI;
boden.receiveShadow=true;

//Himmeltextur
const skyTEX = textureLoader.load('../textures/sky.jpg');
skyTEX.wrapS = THREE.RepeatWrapping;
skyTEX.wrapT = THREE.RepeatWrapping;
skyTEX.repeat.set(10,5);

/*
Skydome

Eine große Kugel, die die gesamte Szene umgibt. Sie wirft keinen Schatten und ist von innen Texturiert.
Von innen ensteht so ein Eindruck eines Himmels.
*/ 
const SkyboxGeometrie = new THREE.SphereGeometry(70, 40, 20);
const SkyboxMaterial = new THREE.MeshPhongMaterial({
    map: skyTEX,
    side: THREE.BackSide
});

const Skybox = new THREE.Mesh(SkyboxGeometrie, SkyboxMaterial);
scene.add(Skybox);



/*
Spieler Hinzufügen

Fügt ein Unsichtbares objekt hinzu, dass den Spieler Representiert und berechnet die zugehörige Boundingbox
für die Hit-detection.
*/
const player = new THREE.Mesh(cubeGeometry, cubeMaterial);
player.position.set(0 , 5 , 10);
player.visible = false;
scene.add(player);
player.geometry.computeBoundingBox();

/*
Hitbox

erstellt ein Hitboxobjekt aus dem Unsichtbaren Spielerobjekt und der berechneten Boundingbox 
*/
let playerHB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
playerHB.setFromObject(player);

/*
Spieler Modell laden

Lädt das Flugzeugmodell und richtet es aus.
verwendet den Renderer um das Modell dem Spielerobjekt Folgen zu lassen.
*/
modelMTLLoader.load('../models/AirShip.mtl', function(materials){
    materials.preload();
    modelLoader.setMaterials(materials);
    modelLoader.load('../models/AirShip.obj', function(mesh){
        var material = new THREE.MeshStandardMaterial();
        mesh.children.forEach(function(child) {
            child.material = material;
            child.castShadow = true;
        });
        mesh.position.set(0,0,9);
        mesh.scale.set(0.5,0.5,0.5)
        mesh.rotation.y= 3 * Math.PI;
        scene.add(mesh);
    
        function objrender(){
            mesh.position.x=player.position.x ;
            mesh.position.y=player.position.y -1;
            mesh.rotation.x=player.rotation.x;
            mesh.rotation.z=player.rotation.z * (-1);
            requestAnimationFrame(objrender);
            renderer.render(scene, camera);
        }
        objrender();
    
    });
});





/*
3 Ziele Hinzufügen

Erstellt drei unsichtbare Kugeln, die die Ziele Repräsentieren.
Berechnet außerdem die Boundingbox für jedes Ziel, für die Hit-detection

als Letztes wird für jedes ziel die loadTargetModel funktion aufgerufen um den Zielen ihr Modell zuzuweisen
*/
const target1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
target1.position.set(0, 5, 0);
target1.visible = false;
scene.add(target1);
loadTargetModel(target1);
const target2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
target2.visible = false;
target2.position.set(15, 5, -30);
scene.add(target2);
loadTargetModel(target2);
const target3 = new THREE.Mesh(sphereGeometry, sphereMaterial);
target3.position.set(-5, 5, -60);
target3.visible = false;
scene.add(target3);
loadTargetModel(target3);

//  boundingboxes
target1.geometry.computeBoundingBox();
target2.geometry.computeBoundingBox();
target3.geometry.computeBoundingBox();

// Erstellt die Hitboxobjekte aus den target objekten
let target1HB = new THREE.Sphere(target1.position, 3);
let target2HB = new THREE.Sphere(target2.position, 3);
let target3HB = new THREE.Sphere(target3.position, 3);

//lädt die Goldtextur für die Zielmodelle
const ringTex= textureLoader.load('../textures/gold.jpg');
ringTex.wrapS = THREE.RepeatWrapping;
ringTex.wrapT = THREE.RepeatWrapping;
ringTex.repeat.set(10,20);

/*
Funktion zum laden der Ringmodelle

Nimmt ein target-Objekt.
Lädt das Ringmodell; positioniert und Texturiert es.

Verwendet den Renderer um den nun geladenen Ring seinem zugehörigen Zielobjekt folgen zu lassen.
*/
function loadTargetModel(target){
    modelLoader.load('../models/circle.obj',function(mesh){
        var material = new THREE.MeshStandardMaterial({
            map: ringTex
    });
        mesh.children.forEach(function(child) {
            child.material = material;
            child.castShadow = true;
        });
        mesh.position.set(0,-10,0);
        mesh.scale.set(0.4,0.4,0.4)
        scene.add(mesh);
    
        function objRender(){
            mesh.position.x=target.position.x;
            mesh.position.y=target.position.y -12.75;
            mesh.position.z=target.position.z;
            requestAnimationFrame(objRender);
            renderer.render(scene, camera);
        }
        objRender();
    });
}

/*
Spielersteuerung Event-listener

Implementiert einen Event-Listener der auf Tastendruck reagiert

Wen eine Pfeiltaste gedrückt wird, bewegt sich das Flugzeug in die enstsprechende Richtung
(bewegung nach links oder rechts ist Schneller als hoch oder Runter. Außerdem ist der Bereeich in dem sich der Spieler bewegen kann in alle vier Richtungen begrenzt)
Des weiteren wird das Flugzeug in die Entsprechende Richtung geneigt. Daurch soll ein dynamischerer Eindruck enstehen und es soll so ausehen, als ob das Flugzeug sich tatsächlich
in der Luft befindet.
(die Neigung nach links und Rechts ist ebenfalls beschränkt damit das Flugzeug sich nicht überschlägt)
*/
document.addEventListener("keydown", onDocumentKeyDown, false); 

function onDocumentKeyDown(e){
    
    switch (e.key) {
        case 'ArrowUp':
            if (player.position.y <=10){
                player.position.y +=0.3;
                player.rotation.x += 0.04;
            }
            break;
        
        case 'ArrowDown':
            if (player.position.y >=2){
                player.position.y -= 0.3;
                player.rotation.x -= 0.04;
            }
            break;
        case 'ArrowLeft':
            if (player.position.x >= -15){
                player.position.x -= 0.5;
                if(player.rotation.z<0.7) player.rotation.z += 0.05;
            }
            break;
        case 'ArrowRight':
            if (player.position.x <=15){
                player.position.x += 0.5;
                if(player.rotation.z> -0.7) player.rotation.z -= 0.05;
            }
            break;
        default:
            break;
            
    }
}

// ausrichtung der Kamera
camera.lookAt(player.position);


//Main-Renderfunktion
function render(){

// main Gameplay loop - wird nur ausführt wenn der Spieler leben übrig hat
if(Life>0){
// bewegt die Ziele und vergibt Punkte    
update(target1);
update(target2);
update(target3);

// Rotiert den Boden-zylinder um vorwärtsbewegung vorzutäuschen
boden.rotation.x +=0.002;

// Benötigte Code Zeile um die Boundingbox des Spielers zu bewegen
playerHB.copy( player.geometry.boundingBox).applyMatrix4(player.matrixWorld);

// Gleicht die Rotation der Steuerung aus 
rotationUpdate(player);

// updatet das Statistikfenster
updateStats();

// Checkt ob der Spieler sich aktuell in einem Ring befindet
hitdetect(playerHB, target1HB);
hitdetect(playerHB, target2HB);
hitdetect(playerHB, target3HB);

// hällt die Kamera hinter dem Spieler
camera.position.x=player.position.x;

}else{
// ruft den Game-over Screen auf und stoppt das Spiel
gameOver();
}    
requestAnimationFrame(render);
renderer.render(scene, camera);
}
render();
