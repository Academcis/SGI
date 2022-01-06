var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight,0.01, 1000)
camera.position.set(0,6,11) 
camera.lookAt(0,0,0)

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

var startRotation=0;
var cube= null;

var bulbLight = null, bulbMat = null
var lampSphere = null

var palette = null
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

/*Lights*/
var rotate = 0;
var lightTime =0;
var HemisphereLight = new THREE.HemisphereLight(0x404040, 0x080820, 3);
scene.add(HemisphereLight)
var DirLight = new THREE.DirectionalLight(0xFFCC99, 1);
DirLight.castShadow = true;
/*End of lights*/

var actionLeftDoorAction = null
var actionRigthDoorAction = null
var actionVaso1 = null
var actionVaso2 = null, actionVaso3 = null, actionVaso4 = null

var myCanvasMovel = document.getElementById("myCanvasMovel")

var renderer = new THREE.WebGLRenderer({canvas:myCanvasMovel})
renderer.setSize(545,400)
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio( window.devicePixelRatio );

new THREE.OrbitControls(camera, renderer.domElement)

var newColor = new THREE.Color("lightCoral")
var alterarCorPortas = 0
var defaultColor = null
var leftDoor = null, rightDoor = null
var defaultTexture = null
var furniture = null

var target = null
var doors = []

var vaso1 = null, vaso2 = null, vaso3 = null, vaso4 = null, vaso5 = null, vaso6 = null

/* Variáveis para o texto das dimensões */
var textoAlturaPrincipal = null, textoAlturaMeio = null, textoAlturaRecipiente = null
var textoLarguraDireita = null, textoLarguraEsquerda = null, textoLarguraPortas = null, textoLarguraPrincipal = null
var textoProfundidadeNormal = null, textoProfundidadePortasDir = null, textoProfundidadePortasEsq = null

loadScene()
animate()
addLightsDawn()
actionButtons()

function addBulb(number){
    const bulbGeometry = new THREE.SphereGeometry(0.3, 16, 8);
    bulbLight = new THREE.PointLight(0xFFBC47, number, 100, 2);
	//0xFFBC47
    bulbMat = new THREE.MeshStandardMaterial({
        emissive: 0xFFBC47,
		emissiveIntensity: 1,
		color: 0x000000
    })
    bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
	bulbLight.position.set( 12.7, 15, -11.9 );
    bulbLight.castShadow = true;
    scene.add( bulbLight );
    //scene.add(new THREE.CameraHelper(bulbLight.shadow.camera))
}

function animate(){
    requestAnimationFrame(animate)
    TWEEN.update();
    mixer.update(clock.getDelta())
    if(startRotation==1){
        cube.rotateY(0.02);
    }
    if(startRotation == 2){
        cube.rotation.set(0,0,0);
    }
    renderer.render(scene, camera)
}

function loadScene(){
    var loader = new THREE.GLTFLoader()
    loader.load(
        'models/movelJardinagem.gltf',
        function(gltf){
            scene.add(gltf.scene)
            gltf.scene.traverse(function(x){
                if (x instanceof THREE.Light) x.visible = false
            })
            
            var leftDoorAction = THREE.AnimationClip.findByName(gltf.animations, "NlaLD") 
            var rightDoorAction = THREE.AnimationClip.findByName(gltf.animations, "NlaRD") 
            actionLeftDoorAction = mixer.clipAction(leftDoorAction)
            actionRigthDoorAction = mixer.clipAction(rightDoorAction)

            var vaso1animation = THREE.AnimationClip.findByName(gltf.animations, "NlaVaso1") 
            var vaso2animation = THREE.AnimationClip.findByName(gltf.animations, "NlaVaso2") 
            var vaso3animation = THREE.AnimationClip.findByName(gltf.animations, "NlaVaso3") 
            var vaso4animation = THREE.AnimationClip.findByName(gltf.animations, "NlaVaso4") 
            actionVaso1 = mixer.clipAction(vaso1animation)
            actionVaso2 = mixer.clipAction(vaso2animation)
            actionVaso3 = mixer.clipAction(vaso3animation)
            actionVaso4 = mixer.clipAction(vaso4animation)

            scene.traverse(function(objMesh){
                if(objMesh.isMesh){
                    objMesh.castShadow = true
                    objMesh.receiveShadow = true
                }

                if(objMesh.name == "rightDoor"){ 
                    rightDoor = objMesh
                    doors.push(objMesh) //só entra aqui se encontrar o "rightDoor"
                }
                
                if(objMesh.name == "leftDoor"){
                    leftDoor = objMesh
                    defaultColor = leftDoor.material.color
                    doors.push(objMesh)
                }  

                if(objMesh.name == "sink"){
                    sinkGeometry = objMesh
                }

                if(objMesh.name == "Sphere"){
                    sphere = objMesh
                    sphere.castShadow = false
                }

                if(objMesh.name == "LampPost"){
                    lampPost = objMesh
                    lampPost.castShadow = false
                }

                if(objMesh.name.includes("cube")){ 
                    if(objMesh.name == "cube1"){
                        crate1 = objMesh
                        cratesArray.push(crate1)
                        crate1.visible = !crate1.visible
                    }
                    if(objMesh.name == "cube2"){
                        crate2 = objMesh
                        cratesArray.push(crate2)
                        crate2.visible = !crate2.visible
                    }
                    if(objMesh.name == "cube3"){
                        crate3 = objMesh
                        cratesArray.push(crate3)
                        crate3.visible = !crate3.visible
                    }
                    if(objMesh.name == "cube4"){
                        crate4 = objMesh
                        cratesArray.push(crate4)
                        crate4.visible = !crate4.visible
                    }
                }

                if(objMesh.name.includes("vaso")){
                    if(objMesh.name == "vaso1"){
                        vaso1 = objMesh
                        vaso1.visible = !vaso1.visible
                    }

                    if(objMesh.name == "vaso2s"){
                        vaso2 = objMesh
                        objMesh.visible = !objMesh.visible
                    }

                    if(objMesh.name == "vaso3"){
                        vaso3 = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "vaso4"){
                        vaso4 = objMesh
                        objMesh.visible = !objMesh.visible
                    }

                    if(objMesh.name == "vaso5"){
                        vaso5 = objMesh
                        objMesh.visible = !objMesh.visible
                    }

                    if(objMesh.name == "vaso6"){
                        vaso6 = objMesh
                        objMesh.visible = !objMesh.visible
                    } 
                }

                if(objMesh.name == "horizontalWood"){
                    defaultTexture = objMesh.material.map
                    furniture = objMesh
                    console.log("furniture found")
                    //objMesh.visible = !objMesh.visible
                }

                if(objMesh.name.includes("Text")){
                    if(objMesh.name == "TextAlturaPrincipal"){
                        textoAlturaPrincipal = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "TextAlturaMeio"){
                        textoAlturaMeio = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "TextAlturaRecipiente"){
                        textoAlturaRecipiente = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "TextLarguraComPortaDireita"){
                        textoLarguraDireita = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "TextLarguraComPortaEsquerda"){
                        textoLarguraEsquerda = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "TextLarguraComPortasAbertas"){
                        textoLarguraPortas = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "TextLarguraPrincipal"){
                        textoLarguraPrincipal = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "TextProfundidadeRecipiente"){
                        textoProfundidadeNormal = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "TextProfundidadeRecipienteAbertoDir"){
                        textoProfundidadePortasDir = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                    if(objMesh.name == "TextProfundidadeRecipienteAbertoEsq"){
                        textoProfundidadePortasEsq = objMesh
                        objMesh.visible = !objMesh.visible
                    }
                }

                if(objMesh.name == "paletteTexturas"){
                    palette = objMesh
                    objMesh.visible = !objMesh.visible
                    palette.castShadow = false
                    palette.receiveShadow = false
                }
            })
            for(var i = 0; i < cratesArray.length; i++){
                console.log("Mesh added to cratesArray []: " + cratesArray[i].name)
            }

            var box = new THREE.BoxGeometry(0.01,0.01,0.01);
            var boxMaterial = new THREE.MeshBasicMaterial({color: "gray"});
            cube = new THREE.Mesh(box,boxMaterial)
            cube.position.set(0,0,0)
            scene.add(cube)
            cube.add(sinkGeometry);
            cube.add(rightDoor);
            cube.add(leftDoor);
            cube.add(vaso1);
            cube.add(vaso2);
            cube.add(vaso3)
            cube.add(vaso4)
            cube.add(vaso5)
            cube.add(vaso6)
            cube.add(furniture)    
            cube.add(textoAlturaMeio)    
            cube.add(textoAlturaPrincipal)    
            cube.add(textoAlturaRecipiente)    
            cube.add(textoLarguraDireita)    
            cube.add(textoLarguraEsquerda)    
            cube.add(textoLarguraPortas)    
            cube.add(textoLarguraPrincipal)    
            cube.add(textoProfundidadeNormal)    
            cube.add(textoProfundidadePortasDir)    
            cube.add(textoProfundidadePortasEsq)  
        }
    )
}

function resetCameraSmooth(){
    smoothTransition(camera.position, {x:0,y:6,z:11})
    setTimeout(function(){camera.lookAt(0,0,0)},1000)
}

function resetCamera(){
    camera.position.set(0,6,11)
    camera.lookAt(0,0,0)
}

function smoothTransition(initialCoords, destinationCoords){
    tween = new TWEEN.Tween(initialCoords)
    .to(destinationCoords, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
        camera.position.x = initialCoords.x;
        camera.position.y = initialCoords.y;
        camera.position.z = initialCoords.z;


    }).start()
}

function addLightsNight(){
    scene.remove(DirLight)
    scene.remove(bulbLight)
    scene.background = new THREE.Color(0x272146) 
    renderer.toneMapping = THREE.ReinhardToneMapping;
    addBulb(1500)
}

function addLightsSunset(){
    scene.remove(DirLight)
    scene.remove(bulbLight)
    scene.background = new THREE.Color(0xEFB59D) 
    DirLight.position.set(-60,60,-200);
    scene.add(DirLight)
    renderer.toneMapping = THREE.ReinhardToneMapping;
    addBulb(500)
}

function addLightsMidDay(){

    scene.remove(DirLight)
    scene.remove(bulbLight)
    scene.background = new THREE.Color(0xC1EDFF) 
    DirLight.position.set(5,15,00);
    scene.add(DirLight)
    renderer.toneMapping = THREE.ReinhardToneMapping;
    addBulb(0)
}

function addLightsDawn(){
    scene.remove(DirLight)
    scene.remove(bulbLight)
    scene.background = new THREE.Color(0xFFE5CC) 
    DirLight.position.set(30,40,50);
    scene.add(DirLight)
    renderer.toneMapping = THREE.ReinhardToneMapping;
    addBulb(400)
}

var esq_aberta = 0
var dir_aberta = 0
var pausa = 0
var dia = 0
var rotacao = 0
let mesh
var changeSinkTexture = 0
var changeFurnitureTexture = 0
var animacao_vasos = 0
var mostrarDimensoes = 0

function actionButtons(){
    document.getElementById("btn_open_doors_M").onclick = function(){
        if(esq_aberta == 0 && dir_aberta == 1){
            smoothTransition(camera.position,{x: 0,y: 2, z: 6})
            actionLeftDoorAction.reset()
            actionLeftDoorAction.timeScale = 1
            actionLeftDoorAction.setLoop(THREE.LoopOnce)
            actionLeftDoorAction.clampWhenFinished = true
            actionLeftDoorAction.play()
            esq_aberta = 1
        }
        if(esq_aberta == 1 && dir_aberta == 0){
            smoothTransition(camera.position,{x: 0,y: 2, z: 6})
            actionRigthDoorAction.reset()
            actionRigthDoorAction.timeScale = 1
            actionRigthDoorAction.setLoop(THREE.LoopOnce)
            actionRigthDoorAction.clampWhenFinished = true
            actionRigthDoorAction.play()
            dir_aberta = 1
        }
        if(esq_aberta == 0 && dir_aberta == 0){
            smoothTransition(camera.position,{x: 0,y: 2, z: 6})
            actionLeftDoorAction.reset()
            actionLeftDoorAction.timeScale = 1
            actionLeftDoorAction.setLoop(THREE.LoopOnce)
            actionLeftDoorAction.clampWhenFinished = true
            actionLeftDoorAction.play()

            actionRigthDoorAction.reset()
            actionRigthDoorAction.timeScale = 1
            actionRigthDoorAction.setLoop(THREE.LoopOnce)
            actionRigthDoorAction.clampWhenFinished = true
            actionRigthDoorAction.play()

            dir_aberta = 1
            esq_aberta = 1
        }
     }

     document.getElementById("btn_close_doors_M").onclick = function(){
        if(esq_aberta == 1 && dir_aberta == 0){
            resetCameraSmooth()
            actionLeftDoorAction.timeScale = -1  
            actionLeftDoorAction.setLoop(THREE.LoopOnce)   
            actionLeftDoorAction.clampWhenFinished = true
            actionLeftDoorAction.paused = false  
            actionLeftDoorAction.play() 
            esq_aberta = 0
        }
        if(esq_aberta == 0 && dir_aberta == 1){
            resetCameraSmooth()
            actionRigthDoorAction.timeScale = -1  
            actionRigthDoorAction.setLoop(THREE.LoopOnce)   
            actionRigthDoorAction.clampWhenFinished = true
            actionRigthDoorAction.paused = false  
            actionRigthDoorAction.play() 
            dir_aberta = 0
        }
        if(esq_aberta == 1 && dir_aberta == 1){
            resetCameraSmooth()
            actionLeftDoorAction.timeScale = -1  
            actionLeftDoorAction.setLoop(THREE.LoopOnce)   
            actionLeftDoorAction.clampWhenFinished = true
            actionLeftDoorAction.paused = false  
            actionLeftDoorAction.play() 

            actionRigthDoorAction.timeScale = -1  
            actionRigthDoorAction.setLoop(THREE.LoopOnce)   
            actionRigthDoorAction.clampWhenFinished = true
            actionRigthDoorAction.paused = false  
            actionRigthDoorAction.play() 

            dir_aberta = 0
            esq_aberta = 0
        }
     }

    document.getElementById("btn_left_door_open_M").onclick = function(){
        if(esq_aberta == 0){
            smoothTransition(camera.position,{x: 0, y: 2, z: 5})
            camera.lookAt(-4,-2,1)
            actionLeftDoorAction.reset()
            actionLeftDoorAction.timeScale = 1
            actionLeftDoorAction.setLoop(THREE.LoopOnce)
            actionLeftDoorAction.clampWhenFinished = true
            actionLeftDoorAction.play()
            esq_aberta = 1
        }
        
     }

     document.getElementById("btn_left_door_close_M").onclick = function(){
        if(esq_aberta == 1){
            resetCameraSmooth()
            actionLeftDoorAction.timeScale = -1  
            actionLeftDoorAction.setLoop(THREE.LoopOnce)   
            actionLeftDoorAction.clampWhenFinished = true
            actionLeftDoorAction.paused = false  
            actionLeftDoorAction.play() 
            esq_aberta = 0
        }
     }

     document.getElementById("btn_right_door_open_M").onclick = function() {
        if(dir_aberta == 0){
            smoothTransition(camera.position,{x: 0, y: 2, z: 6})
            camera.lookAt(2,2,4)
            actionRigthDoorAction.reset()
            actionRigthDoorAction.timeScale = 1
            actionRigthDoorAction.setLoop(THREE.LoopOnce)
            actionRigthDoorAction.clampWhenFinished = true
            actionRigthDoorAction.play()
            dir_aberta = 1
        }
     }

     document.getElementById("btn_right_door_close_M").onclick = function() {
        if(dir_aberta == 1){
            resetCameraSmooth()
            actionRigthDoorAction.timeScale = -1  
            actionRigthDoorAction.setLoop(THREE.LoopOnce)   
            actionRigthDoorAction.clampWhenFinished = true
            actionRigthDoorAction.paused = false  
            actionRigthDoorAction.play() 
            dir_aberta = 0
        }
    }

     document.getElementById("btn_stop_M").onclick = function(){
         actionLeftDoorAction.stop()
         actionRigthDoorAction.stop()
         dir_aberta = 0
         esq_aberta = 0
         startRotation = 2

     }
     
     document.getElementById("btn_pause_M").onclick = function(){
         if(pausa == 0){
            actionLeftDoorAction.paused = true
            actionRigthDoorAction.paused = true
            actionVaso1.paused = true
            actionVaso2.paused = true
            pausa = 1
            if(startRotation==1){
                startRotation=0
            }
        }else{
            actionLeftDoorAction.paused = false
            actionRigthDoorAction.paused = false
            actionVaso1.paused = false
            actionVaso2.paused = false
            pausa = 0
            if(startRotation==0){
                startRotation=1
            }
        }
    }

    document.getElementById("btn_reset_view_M").onclick = function(){
        resetCameraSmooth()
    }

    document.getElementById("btn_main_texture_M").onclick = function(){
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

    document.getElementById("btn_change_doors_color_M").onclick = function(){
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

    document.getElementById("btn_change_sink_texture_M").onclick = function(){
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
        palette.visible = !palette.visible
    }

    document.getElementById("btn_rotate_M").onclick = function(){
        if(startRotation==0 || startRotation==2){
            startRotation = 1
        }else{
            startRotation = 2
        } 
    }

    document.getElementById("btn_day_night_M").onclick = function(){
        switch(lightTime){
            case 0:
                addLightsMidDay();
                lightTime++;
                break;
            case 1:
                addLightsSunset();
                lightTime++;
                break;
            case 2:
                addLightsNight();
                lightTime++;
                break;    
            case 3:
                addLightsDawn();
                lightTime=0;
                break;
        }
    }
    
    document.getElementById("btn_show_objects_M").onclick = function(){
        vaso1.visible = !vaso1.visible
        vaso2.visible = !vaso2.visible
        vaso3.visible = !vaso3.visible
        vaso4.visible = !vaso4.visible
        vaso5.visible = !vaso5.visible
        vaso6.visible = !vaso6.visible
        if(animacao_vasos == 0){
            actionVaso1.reset()
            actionVaso1.timeScale = 1
            actionVaso1.setLoop(THREE.LoopOnce)
            actionVaso1.clampWhenFinished = true
            actionVaso1.play()

            actionVaso2.reset()
            actionVaso2.timeScale = 1
            actionVaso2.setLoop(THREE.LoopOnce)
            actionVaso2.clampWhenFinished = true
            actionVaso2.play()

            actionVaso3.reset()
            actionVaso3.timeScale = 1
            actionVaso3.setLoop(THREE.LoopOnce)
            actionVaso3.clampWhenFinished = true
            actionVaso3.play()

            actionVaso4.reset()
            actionVaso4.timeScale = 1
            actionVaso4.setLoop(THREE.LoopOnce)
            actionVaso4.clampWhenFinished = true
            actionVaso4.play()
            animacao_vasos = 1
        }
        animacao_vasos = 0
    }

    document.getElementById("btn_show_dimensions_M").onclick = function(){
        if(mostrarDimensoes == 0){
            textoAlturaPrincipal.visible = true
            textoAlturaMeio.visible = true
            textoAlturaRecipiente.visible = true
            textoLarguraPrincipal.visible = true
            textoProfundidadeNormal.visible = true
            if(dir_aberta == 1){
                textoProfundidadePortasDir.visible = true
                if(esq_aberta == 1){
                    textoLarguraPortas.visible = true
                }else{
                    textoLarguraDireita.visible = true
                }
            }
            if(esq_aberta == 1 && dir_aberta == 0){
                textoProfundidadePortasEsq.visible = true
                textoLarguraEsquerda.visible = true
            }
            mostrarDimensoes = 1
        }else{
            textoAlturaPrincipal.visible = false
            textoAlturaMeio.visible = false
            textoAlturaRecipiente.visible = false
            textoLarguraPrincipal.visible = false
            textoLarguraPortas.visible = false
            textoLarguraDireita.visible = false
            textoLarguraEsquerda.visible = false
            textoProfundidadeNormal.visible = false
            textoProfundidadePortasDir.visible = false
            textoProfundidadePortasEsq.visible = false
            mostrarDimensoes = 0
        }
    }
}

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
