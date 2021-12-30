var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight,0.01, 1000)
camera.position.set(0,6,15) 
camera.lookAt(0,0,0)

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

var crate1 = null, crate2 = null, crate3 = null, crate4 = null
var sinkGeometry = null
var cratesArray = []

window.onclick = function(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1 
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1  
    console.log("x: "+ mouse.x + "y: "+ mouse.y)
    pickCrateTexture()
    pickDoors()
}


var clock = new THREE.Clock()
var mixer = new THREE.AnimationMixer(scene)

var actionLeftDoorAction = null
var actionRigthDoorAction = null

var myCanvas = document.getElementById("myCanvas")

// var grid = new THREE.GridHelper()
// scene.add(grid)
// var axes = new THREE.AxesHelper(8)
// scene.add(axes)

var renderer = new THREE.WebGLRenderer({canvas:myCanvas})
renderer.setSize(545,400)
renderer.shadowMap.enabled = true

new THREE.OrbitControls(camera, renderer.domElement)

var newColor = new THREE.Color("lightCoral")
var alterarCorPortas = 0
var defaultColor = null
var leftDoor = null, rightDoor = null
var defaultTexture = null
var furniture = null

var target = null
var doors = []

loadScene()
animate()
addlights()
actionButtons()

function loadScene(){
    var loader = new THREE.GLTFLoader()
    loader.load(
        'models/movelJardinagem_v2.gltf',
        function(gltf){
            scene.add(gltf.scene)
            gltf.scene.traverse(function(x){
                if (x instanceof THREE.Light) x.visible = false
            })
            
            var leftDoorAction = THREE.AnimationClip.findByName(gltf.animations, "NlaLD") 
            var rightDoorAction = THREE.AnimationClip.findByName(gltf.animations, "NlaRD") 
            actionLeftDoorAction = mixer.clipAction(leftDoorAction)
            actionRigthDoorAction = mixer.clipAction(rightDoorAction)

            scene.traverse(function(objMesh){
                if(objMesh.isMesh){
                    objMesh.castShadow = true
                    objMesh.receiveShadow = true
                }
                //FALTA POR ISTO A FUNCIONAR (Carregar diretamente na porta para a abrir)
                if(objMesh.name == "rightDoor"){ 
                    rightDoor = objMesh
                    doors.push(objMesh) //só entra aqui se encontrar o "rightDoor"
                }else if(objMesh.name == "leftDoor"){
                    leftDoor = objMesh
                    defaultColor = leftDoor.material.color
                    doors.push(objMesh)
                   // defaultColor = leftDoorColor
                    // doors[1] = objMesh //só entra aqui se encontrar o "leftDoor"
                }  
                if(objMesh.name == "sink"){
                   // var envMap = p
                    //sinkGeometry = objMesh.geometry
                    sinkGeometry = objMesh
                    //sinkGeometry.transparent = true
                }else if(objMesh.name.includes('cube')){ 
                    if(objMesh.name == "cube1"){
                        crate1 = objMesh
                    }
                    if(objMesh.name == "cube2"){
                        crate2 = objMesh
                    }
                    if(objMesh.name == "cube3"){
                        crate3 = objMesh
                    }
                    if(objMesh.name == "cube4"){
                        crate4 = objMesh
                    }
                    cratesArray.push(objMesh)
                    objMesh.visible = !objMesh.visible
                }
                
                if(objMesh.name == "horizontalWood"){
                    defaultTexture = objMesh.material.map
                    furniture = objMesh
                    console.log("furniture found")
                    //objMesh.visible = !objMesh.visible
                }
            })
            for(var i = 0; i < cratesArray.length; i++){
                console.log("Mesh added to cratesArray []: " + cratesArray[i].name)
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
var rotacao = 0
let mesh
var changeSinkTexture = 0
var changeFurnitureTexture = 0


function actionButtons(){
    document.getElementById("btn_left_door_open").onclick = function(){
        if(esq_aberta == 0){
            camera.position.set(3,3,8)
            camera.lookAt(0,0,5)
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
            camera.position.set(-4,5,10)
            camera.lookAt(2,2,8)
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
        camera.position.set(0,6,15) 
        camera.lookAt(0,0,0) 
    }

    document.getElementById("btn_main_texture").onclick = function(){
        const texture = new THREE.TextureLoader().load('models/materials/marble.jpg')
        texture.flipY = false
        if(changeFurnitureTexture == 0){
            furniture.material.map = texture
            changeFurnitureTexture = 1
        }else{
            furniture.material.map = defaultTexture
            changeFurnitureTexture = 0
        }
    }

    document.getElementById("btn_change_doors_color").onclick = function(){
        if(alterarCorPortas == 0){
            leftDoor.material.color = newColor
            rightDoor.material.color = newColor
            alterarCorPortas = 1
        }else{
            leftDoor.material.color = defaultColor
            rightDoor.material.color = defaultColor
            alterarCorPortas = 0
        }
    }

    document.getElementById("btn_change_sink_texture").onclick = function(){
        if(changeSinkTexture == 0){
            camera.position.set(0,6,15) 
            camera.lookAt(0,0,0) 
            changeSinkTexture = 1
        }else{
            changeSinkTexture = 0
        }
        crate1.visible = !crate1.visible
        crate2.visible = !crate2.visible
        crate3.visible = !crate3.visible
        crate4.visible = !crate4.visible
    }


    document.getElementById("btn_rotate").onclick = function(){
        if(rotacao == 0){
            
            rotacao = 1
        }else{
            sinkGeometry.rotation.y = 0
            rotacao = 0
        }
        // function animate() {

        //     requestAnimationFrame( animate );

        //     mesh.rotation.x += 0.005;
        //     mesh.rotation.y += 0.01;

        //     renderer.render( scene, camera );

        // }
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

    
    document.getElementById("btn_show_objects").onclick = function(){
        //sinkGeometry.opacity = 0;
        //console.log("esconder")
        
        // new THREE.GLTFLoader().load('models/movel_extra_objects.glb', result => {
        //     var model1 = result.scene.children[0]
        //     model1.position.set(-10,0,0)
        //     model1.material.opacity = 0.1
        //     model1.material.transparent = true
        //     scene.add(model1)
        //     animate()
        // })

        //sinkGeometry.visible = !sinkGeometry.visible
    }

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

function pickDoors(){
    raycaster.setFromCamera(mouse,camera)
    var intersectedObjects = raycaster.intersectObjects(doors)
    if(intersectedObjects.length > 0){
        if(intersectedObjects[0].object.name == "leftDoor"){
            //console.log('I got left door')
            changeLeftDoorState()
        }else{
            //console.log('I got right door')
            changeRightDoorState()
        }
    }
}

function pickCrateTexture(){
    if(changeSinkTexture == 1){
        raycaster.setFromCamera(mouse,camera)
        var intersectedCrates = raycaster.intersectObjects(cratesArray)
        console.log(intersectedCrates.length)
        if(intersectedCrates.length > 0){
            sinkGeometry.material = intersectedCrates[0].object.material
        }
    }    
}

function changeLeftDoorState(){
    if(esq_aberta == 0){
        actionLeftDoorAction.reset()
        actionLeftDoorAction.timeScale = 1
        actionLeftDoorAction.setLoop(THREE.LoopOnce)
        actionLeftDoorAction.clampWhenFinished = true
        actionLeftDoorAction.play()
        esq_aberta = 1
    }else{
        actionLeftDoorAction.timeScale = -1  
        actionLeftDoorAction.setLoop(THREE.LoopOnce)   
        actionLeftDoorAction.clampWhenFinished = true
        actionLeftDoorAction.paused = false  
        actionLeftDoorAction.play() 
        esq_aberta = 0
    }
}

function changeRightDoorState(){
    if(dir_aberta == 0){
        actionRigthDoorAction.reset()
        actionRigthDoorAction.timeScale = 1
        actionRigthDoorAction.setLoop(THREE.LoopOnce)
        actionRigthDoorAction.clampWhenFinished = true
        actionRigthDoorAction.play()
        dir_aberta = 1
    }else{
        actionRigthDoorAction.timeScale = -1  
        actionRigthDoorAction.setLoop(THREE.LoopOnce)   
        actionRigthDoorAction.clampWhenFinished = true
        actionRigthDoorAction.paused = false  
        actionRigthDoorAction.play() 
        dir_aberta = 0
    }
}

