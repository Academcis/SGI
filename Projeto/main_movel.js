var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight,0.01, 1000)
camera.position.set(5,4,9) 
camera.lookAt(0,7,-2)

var clock = new THREE.Clock()
var mixer = new THREE.AnimationMixer(scene)

var actionLeftDoorAction = null
var actionRigthDoorAction = null

var myCanvas = document.getElementById("myCanvas")

var grid = new THREE.GridHelper()
scene.add(grid)
var axes = new THREE.AxesHelper(8)
scene.add(axes)

var renderer = new THREE.WebGLRenderer({canvas:myCanvas})
renderer.setSize(545,400)
renderer.shadowMap.enabled = true

new THREE.OrbitControls(camera, renderer.domElement)

var target = null
var doors = []
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

loadScene()
animate()
addlights()
actionButtons()

function loadScene(){
    var loadBench = new THREE.GLTFLoader()
    loadBench.load( 
        'models/movelJardinagem_v2.gltf',
        function(gltf){
            scene.add(gltf.scene)
            gltf.scene.traverse(function(x){
                if (x instanceof THREE.Light) x.visible = false
            })
            //scene.getObjectByName("rightDoor").visible = true
            var leftDoorAction = THREE.AnimationClip.findByName(gltf.animations, "NlaLD") 
            var rightDoorAction = THREE.AnimationClip.findByName(gltf.animations, "NlaRD") 
            actionLeftDoorAction = mixer.clipAction(leftDoorAction)
            actionRigthDoorAction = mixer.clipAction(rightDoorAction)

            scene.traverse(function(objMesh){
                if(objMesh.isMesh){
                    objMesh.castShadow = true
                    objMesh.receiveShadow = true
                }

                if(objMesh.name == "rightDoor"){ 
                    doors[0] = objMesh //só entra aqui se encontrar o "rightDoor"
                }else if(objMesh.name == "leftDoor"){
                    doors[1] = objMesh //só entra aqui se encontrar o "leftDoor"
                }  
            })

            for(var i = 0; i < doors.length; i++){
                console.log("Mesh added to doors []: " + doors[i].name)
            }
        }
    )
}

function animate(){
    requestAnimationFrame(animate)
    mixer.update(clock.getDelta())
    renderer.render(scene, camera)
}


function addlights(){
    var ambientLight = new THREE.AmbientLight("white", 0.55)
    scene.add(ambientLight)

    var pointLight = new THREE.PointLight("white")
    pointLight.position.set(10,6,0)
    pointLight.castShadow = true
    scene.add(pointLight)
}

// var hemilight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
// hemiLight.color.setHSV( 0.6, 0.75, 0.5 );
// hemiLight.groundColor.setHSV( 0.095, 0.5, 0.5 );
// hemiLight.position.set( 0, 500, 0 );
// scene.add(hemilight);

var esq_aberta = 0
var dir_aberta = 0
var pausa = 0
var dia = 0

 function actionButtons(){
     document.getElementById("btn_left_door_open").onclick = function(){
        if(esq_aberta == 0){
            camera.position.set(2,3,5)
            camera.lookAt(0,0,2)
            actionLeftDoorAction.reset()
            actionLeftDoorAction.timeScale = 1
            actionLeftDoorAction.setLoop(THREE.LoopOnce)
            actionLeftDoorAction.clampWhenFinished = true
            actionLeftDoorAction.play()
            esq_aberta = 1
        }
        
     }

     document.getElementById("btn_left_door_close").onclick = function(){
        if(esq_aberta == 1){
            actionLeftDoorAction.timeScale = -1  
            actionLeftDoorAction.setLoop(THREE.LoopOnce)   
            actionLeftDoorAction.clampWhenFinished = true
            actionLeftDoorAction.paused = false  
            actionLeftDoorAction.play() 
            esq_aberta = 0
        }
     }

     document.getElementById("btn_right_door_open").onclick = function() {
        if(dir_aberta == 0){
            camera.position.set(2,3,5)
            camera.lookAt(0,0,2)
            actionRigthDoorAction.reset()
            actionRigthDoorAction.timeScale = 1
            actionRigthDoorAction.setLoop(THREE.LoopOnce)
            actionRigthDoorAction.clampWhenFinished = true
            actionRigthDoorAction.play()
            dir_aberta = 1
        }
     }

     document.getElementById("btn_right_door_close").onclick = function() {
        if(dir_aberta == 1){
            actionRigthDoorAction.timeScale = -1  
            actionRigthDoorAction.setLoop(THREE.LoopOnce)   
            actionRigthDoorAction.clampWhenFinished = true
            actionRigthDoorAction.paused = false  
            actionRigthDoorAction.play() 
            dir_aberta = 0
        }
    }

     document.getElementById("btn_stop").onclick = function(){
         actionLeftDoorAction.stop()
         actionRigthDoorAction.stop()
         dir_aberta = 0
         esq_aberta = 0
     }
     
     document.getElementById("btn_pause").onclick = function(){
         if(pausa == 0){
            actionLeftDoorAction.paused = true
            actionRigthDoorAction.paused = true
            pausa = 1
        }else{
            actionLeftDoorAction.paused = false
            actionRigthDoorAction.paused = false
            pausa = 0
        }
    }

    document.getElementById("btn_reset_view").onclick = function(){
        camera.position.set(5,4,9) 
        camera.lookAt(0,7,-2)  
    }

    document.getElementById("btn_day_night").onclick = function(){
        if(dia == 0){
            dia = 1
        }else{
            dia = 0
        }
        if(dia == 0){ //dia
            light = new THREE.SpotLight(0xffa95c,7);
            light.position.set(-50,50,50);
            light.castShadow = true;
        }
        else{ //noite

        }
        scene.add(light);
        renderer.render(scene,camera);
    }
}
window.onclick = function(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1 
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1  
    console.log("x: "+ mouse.x + "y: "+ mouse.y)
    pickDoor()
}

// window.addEventListener('click', event => {
//     raycaster.setFromCamera(mouse, camera)
//     const found = raycaster.intersectObjects(scene.children)
//     if(found.length > 0 && (found[0].object.getObjectByName() == doors[0] || found[0].object.getObjectByName() == doors[1])) {
//         console.log('Found -> ' + found[0].object.getObjectByName())
//     }
//     if(found.length > 0){
//         console.log(found[0].object.getObjectByName())
//     }
// })

function pickDoor(){
    raycaster.setFromCamera(mouse,camera)
    var intersectedObjects = raycaster.intersectObjects(doors)
    if(intersectedObjects.length > 0){
        console.log('I got a door'+ intersectedObjects[0].object)
    }
}
