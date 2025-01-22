


//Renderer Setup
const renderer = new THREE.WebGLRenderer({antialas: true});
renderer.setClearColor(new THREE.Color(0xb0e0e6));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);


//Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xffffff, 15, 115);


//Kamera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / innerHeight, 0.1, 100);
camera.position.y = 13;
camera.position.z = 28;
camera.position.x = 0;


//loader einrichten
const textureLoader = new THREE.TextureLoader();
const modelLoader =new THREE.OBJLoader();
const modelMTLLoader= new THREE.MTLLoader();


// Bodentextur
const groundTex = textureLoader.load('../textures/Ground.jpg');
groundTex.wrapS = THREE.RepeatWrapping;
groundTex.wrapT = THREE.RepeatWrapping;
groundTex.repeat.set(5,3);
const bodenGeometry = new THREE.CylinderGeometry(100,100,120,40);
const bodenMaterial = new THREE.MeshStandardMaterial({
    map: groundTex 

});
//Boden
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

// Skybox
const SkyboxGeometrie = new THREE.SphereGeometry(70, 40, 20);
const SkyboxMaterial = new THREE.MeshPhongMaterial({
    map: skyTEX,
    side: THREE.BackSide
});

const Skybox = new THREE.Mesh(SkyboxGeometrie, SkyboxMaterial);
scene.add(Skybox);




// Platzhalter für ziele
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



//Spieler Hinzufügen
const player = new THREE.Mesh(cubeGeometry, cubeMaterial);
player.position.set(0 , 5 , 10);
player.visible = false;
scene.add(player);
player.geometry.computeBoundingBox();

//Spieler Hitbox erstellen
let playerHB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
playerHB.setFromObject(player);

//Spieler Modell laden
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





// 3 Ziele Hinzufügen
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

// compute boundigboxes for hitdetection
target1.geometry.computeBoundingBox();
target2.geometry.computeBoundingBox();
target3.geometry.computeBoundingBox();

//Target Hitboxes
let target1HB = new THREE.Sphere(target1.position, 3);
let target2HB = new THREE.Sphere(target2.position, 3);
let target3HB = new THREE.Sphere(target3.position, 3);

//lädt das Ringmodel für die Ziele
const ringTex= textureLoader.load('../textures/gold.jpg');
ringTex.wrapS = THREE.RepeatWrapping;
ringTex.wrapT = THREE.RepeatWrapping;
ringTex.repeat.set(10,20);
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

//Spielersteuerung Event-listener
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
camera.lookAt(player.position);

shadowsetup(scene);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

camera.lookAt(player.position);
//Renderfunktion
function render(){
if(Life>0){    
update(target1);
update(target2);
update(target3);
boden.rotation.x +=0.002;
playerHB.copy( player.geometry.boundingBox).applyMatrix4(player.matrixWorld);
rotationUpdate(player);
updateStats();
hitdetect(playerHB, target1HB);
hitdetect(playerHB, target2HB);
hitdetect(playerHB, target3HB);

camera.position.x=player.position.x;

}else{
gameOver();
}    
requestAnimationFrame(render);
renderer.render(scene, camera);
}
render();
