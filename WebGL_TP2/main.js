window.addEventListener('load',main,false);
window.addEventListener("keyup",handleKeyUp,false); 
window.addEventListener("keydown",handleKeyDown,false);

var scene;
var camera;
var cube;
var angleX=0.0; 
var fly;
var velocity = 1.0;
var canvas;
var selectedObject;

function main(){
    init();
    loop();
}

/** ****************************** */
/** initialise les donnees
 *
 */ 
function init(){
    canvas = document.getElementById("webglCanvas"); // récupère la balise canvas de votre page html 
    // ajoute les events
    canvas.addEventListener("click", onClick,false);
    canvas.addEventListener("mousedown",handleMouseDown,false); // sélection 
    canvas.addEventListener("mouseup",handleMouseUp,false); 
    canvas.addEventListener("mousemove",handleMouseMove,false); // translation
    renderer = new THREE.WebGLRenderer({canvas : canvas}); // créé le renderer pour votre canvas
    renderer.setClearColor(new THREE.Color(0xeeeeee),1.0); // couleur en héxa; alpha = opacité = 1.0
    // creer une scene vide
    scene = new THREE.Scene();
    // creer une camera
    camera = new THREE.PerspectiveCamera(45,1.0,0.1,1000);
    //ajouter sphere
    //sphere = new THREE.Mesh(new THREE.SphereGeometry(1.0,10,10), // rayon, méridien, parallèles 
    //new THREE.MeshLambertMaterial( { color : 0x00FF00})); // réflexion diffuse
    //scene.add(sphere);
    // ajouter cubes
    for (i = 0 ; i < 2000 ; i++){
        var geom = Math.random()
        var geometry = new THREE.CubeGeometry(geom, geom, geom); 
        var material = new THREE.MeshLambertMaterial( { color : Math.random()*0xFFFFFF})
        cube = new THREE.Mesh( geometry, material ); 
        scene.add( cube );
        cube.translateOnAxis(new THREE.Vector3((Math.random()-0.5)*100,(Math.random()-0.5) * 50,(Math.random()-0.5)*10),0.5);
    }
    camera.position.z = 5;
    // Ajout d'une lumiere
    var pointLight = new THREE.PointLight(0xFFFFFF); // couleur d'éclairement 
    pointLight.position.z = 10; // pour la positionner 
    scene.add(pointLight); // il faut l'ajouter à la scène (les light dérivent de Object3D).
    fly = new Fly();
}

/** ****************************** */
/** update data for general loop ( called by loop () )
 *
 */
function updateData(){
    //cube.translateOnAxis(new THREE.Vector3(0,0,-1),0.5); // par exemple
    
    //angleX=angleX+0.02; cube.rotateOnAxis(new THREE.Vector3(1,0,0),angleX);
    
    // deplacement fly
    if (fly.pitchIncUpdate){
        camera.translateOnAxis(new THREE.Vector3(0,0,-velocity), 0.2);
    } else if (fly.pitchDecUpdate) {
        camera.translateOnAxis(new THREE.Vector3(0,0,velocity), 0.2);
    }
    if (fly.rollIncUpdate){
        camera.rotateOnAxis(new THREE.Vector3(0,1,0), 0.2);
    } else if (fly.rollDecUpdate) {
        camera.rotateOnAxis(new THREE.Vector3(0,-1,0), 0.2);
    }
    if (fly.velocityIncUpdate){
        velocity+=0.1;
    } else if (fly.velocityDecUpdate) {
        velocity-=0.1
    }
    
    // selection d'objets
   /* 
    ray = new THREE.Raycaster(new THREE.Vector3(0,0,10),new THREE.Vector3(0,0,-1),0,1000); 
   
    var projector=new THREE.Projector(); 
    var ray=projector.pickingRay(new THREE.Vector3(0,0,0),camera);
    var arrayIntersect=ray.intersectObjects(scene.children); 
    if (arrayIntersect.length>0) { 
        var first = arrayIntersect[0]; 
        console.log(first.distance); 
        console.log(first.point); 
        first.object.rotation.z+=0.1; 
    } 
    */
}

/** ****************************** */
/** draw the scene ( called by loop () )
 *
 */
function drawScene(){
    renderer.render(scene,camera);
}

/** ****************************** */
/** main loop : draw , capture event , update scene , and loop again
 *
 */
function loop() {
    drawScene () ;
    updateData () ;
    window.requestAnimationFrame (loop) ;
}

/** ****************************** */
/** clic
 *
 */
function onClick(evt){
    // recuperer coordonnees souris
    var x = evt.clientX;
    var y = evt.clientY;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
 
    while(evt && !isNaN(evt.offsetLeft) && !isNaN(evt.offsetTop)) {
        cx += evt.offsetLeft - evt.scrollLeft;
        cy += evt.offsetTop - evt.scrollTop;
        evt = evt.offsetParent;
    }
    // normaliser coordonnees souris
    x =((x / canvas.width)*2) -1;
    y =-((y / canvas.height) *2) +1;
    console.log(x, y);
    
    var projector=new THREE.Projector(); 
    var ray=projector.pickingRay(new THREE.Vector3(x,y,0),camera);
    var arrayIntersect=ray.intersectObjects(scene.children); 
    if (arrayIntersect.length>0) { 
        var first = arrayIntersect[0]; 
        first.object.rotation.z+=0.1; 
    } 
    
}

/** ****************************** */
/** Bouton appuye (translation)
 *
 */
function handleMouseDown(evt){
    // recuperer coordonnees souris
    var x = evt.clientX;
    var y = evt.clientY;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
 
    while(evt && !isNaN(evt.offsetLeft) && !isNaN(evt.offsetTop)) {
        cx += evt.offsetLeft - evt.scrollLeft;
        cy += evt.offsetTop - evt.scrollTop;
        evt = evt.offsetParent;
    }
    // normaliser coordonnees souris
    x =((x / canvas.width)*2) -1;
    y =-((y / canvas.height) *2) +1;
    
    var projector=new THREE.Projector(); 
    var ray=projector.pickingRay(new THREE.Vector3(x,y,0),camera);
    var arrayIntersect=ray.intersectObjects(scene.children); 
    if (arrayIntersect.length>0) { 
        selectedObject = arrayIntersect[0];
        console.log("object selected");
    }
}

/** ****************************** */
/** bouton souris relache
 *
 */
function handleMouseUp(evt){
    // recuperer coordonnees souris
    var x = evt.clientX;
    var y = evt.clientY;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
 
    while(evt && !isNaN(evt.offsetLeft) && !isNaN(evt.offsetTop)) {
        cx += evt.offsetLeft - evt.scrollLeft;
        cy += evt.offsetTop - evt.scrollTop;
        evt = evt.offsetParent;
    }
    // normaliser coordonnees souris
    x =((x / canvas.width)*2) -1;
    y =-((y / canvas.height) *2) +1;
    
    selectedObject = null;
}

/** ****************************** */
/** drag souris (translation)
 *
 */
function handleMouseMove(evt){
    // recuperer coordonnees souris
    var x = evt.clientX;
    var y = evt.clientY;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
 
    while(evt && !isNaN(evt.offsetLeft) && !isNaN(evt.offsetTop)) {
        cx += evt.offsetLeft - evt.scrollLeft;
        cy += evt.offsetTop - evt.scrollTop;
        evt = evt.offsetParent;
    }
    // normaliser coordonnees souris
    x =((x / canvas.width)*2) -1;
    y =-((y / canvas.height) *2) +1;
    
    selectedObject.object.position.x = selectedObject.object.position.x+x;
    selectedObject.object.position.y = selectedObject.object.position.y+y;
}


/** ****************************** */
/** une touche est relachee
 *
 */
function handleKeyUp(event) { 
    switch (event.keyCode) { 
        case 90 /* z */: 
            fly.pitchIncUpdate=false;
            break; 
        case 83 /* s */: 
            fly.pitchDecUpdate=false;
            break; 
        case 81 /* q */: 
            fly.rollIncUpdate=false;
            break; 
        case 68 /* d */: 
            fly.rollDecUpdate=false;
            break; 
        case 65 /* a */: 
            fly.velocityDecUpdate=false;
            break; 
        case 69 /* e */: 
            fly.velocityIncUpdate=false;
            break; 
    } 
    
} 

/** ****************************** */
/** Une touche est appuyee
 *
 */
function handleKeyDown(event) { 
    switch (event.keyCode) { 
        case 90 /* z */: 
            fly.pitchIncUpdate=true;
            break; 
        case 83 /* s */: 
            fly.pitchDecUpdate=true;
            break; 
        case 81 /* q */: 
            fly.rollIncUpdate=true;
            break; 
        case 68 /* d */: 
            fly.rollDecUpdate=true;
            break; 
        case 65 /* a */: 
            fly.velocityDecUpdate=true;
            break; 
        case 69 /* e */: 
            fly.velocityIncUpdate=true;
            break; 
    } 
}

function Fly(){
    this.pitchIncUpdate;
    this.pitchDecUpdate;
    this.rollIncUpdate;
    this.rollDecUpdate;
    this.velocityIncUpdate;
    this.velocityDecUpdate;
}
