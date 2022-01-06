//const { Vector3 } = Require("three");

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(70, 800/600,0.01, 1000);
camera.position.set(-2,8,15);
camera.lookAt(0,0,0); //para onde quero apontar a camera (neste caso, para o centro)

var clock = new THREE.Clock();
var mixer = new THREE.AnimationMixer(scene);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var startRotation=0;
var cube= null;

var animacao_vasos = 0;

/* Variáveis para as dimensões */
var textoAltura = null,textoAlturaExtensao = null, textoAlturaMeio = null, textoAlturaRecipiente = null
var textoLarguraComPortaDireita = null, textoLarguraComPortaEsquerda = null, textoLarguraCom2Portas = null, textoLarguraComExtensao = null, textoLarguraSemExtensao = null
var textoProfundidadePrincipal = null, textoProfundidadePortasDir = null, textoProfundidadePortasEsq = null
var mostrarDimensoes = 0

/* Objetos extras */
var vasosEmpilhadas = null, vasoMedio = null, vasoPequeno = null, vasoGrande = null, vaso1 = null
var choppedWood = null, pottery = null, rope = null

var marbleMesh = null, defaultTextureMarble = null;
var bulbLight = null, bulbMat = null;
var lampSphere = null;
var workBenchGeometry = null, rightDoorGeometry = null, leftDoorGeometry = null, benchGeometry = null, legGeometry = null, legStickGeometry = null
var crate1 = null, crate2 = null, crate3 = null, palette = null;
var cratesArray = [];
var changeTexture = 0;
var is_BenchExtendOpen = 0;
var is_LegExtendOpen = 0;
var dir_aberta = 0, esq_aberta=0;
var pausa = 0;
var rotate=0;
var lightTime =0;


var HemisphereLight = new THREE.HemisphereLight(0x404040, 0x080820, 3);
scene.add(HemisphereLight);

var DirLight = new THREE.DirectionalLight(0xFFCC99, 1);
DirLight.castShadow = true;

var actionBenchExtendOpen = null;
var actionLegExtendOpen = null;
var actionRightDoor = null;
var actionLeftDoor = null;
var actionRopeAction = null;

var myCanvas = document.getElementById("myCanvasMesa")

var renderer = new THREE.WebGLRenderer({canvas:myCanvas})
renderer.setSize(545,400)
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio( window.devicePixelRatio );

var controls = new THREE.OrbitControls(camera, renderer.domElement) 

/* Variáveis para as dimensões */
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
    var loadBench = new THREE.GLTFLoader()
    loadBench.load( 
        'models/workBenchM.gltf',
        function(gltf){
            scene.add(gltf.scene)
            gltf.scene.traverse(function(x){ //para tornar invisivel a luz que possa existir a mais
                if (x instanceof THREE.Light) x.visible = false
            }) 

            scene.traverse(function(objMesh){
                if(objMesh.isMesh){
                    objMesh.castShadow = true
                    objMesh.receiveShadow = true
                }

                if(objMesh.name == "workBench"){
                    workBenchGeometry = objMesh
                }

                if(objMesh.name == "legExtend1"){
                    legGeometry = objMesh
                }

                if(objMesh.name == "Cube"){
                    legStickGeometry = objMesh
                }

                if(objMesh.name == "benchExtend"){
                    benchGeometry = objMesh
                }

                if(objMesh.name == "door"){
                    rightDoorGeometry = objMesh
                }

                if(objMesh.name == "door1"){
                    leftDoorGeometry = objMesh
                }

                if(objMesh.name == "Sphere"){
                    sphere = objMesh
                    sphere.castShadow = false
                }

                if(objMesh.name == "LampPost"){
                    lampPost = objMesh
                    lampPost.castShadow = false
                }

                if(objMesh.name.includes("WoodCube")){ 
                    if(objMesh.name == "WoodCube1"){
                        crate1 = objMesh
                        cratesArray.push(crate1)
                        crate1.visible = !crate1.visible
                        crate1.castShadow = false
                        crate1.receiveShadow = false
                    }
                    if(objMesh.name == "WoodCube2"){
                        crate2 = objMesh
                        cratesArray.push(crate2)
                        crate2.visible = !crate2.visible
                        crate2.castShadow = false
                        crate2.receiveShadow = false
                    }
                    if(objMesh.name == "WoodCube3"){
                        crate3 = objMesh
                        cratesArray.push(crate3)
                        crate3.visible = !crate3.visible
                        crate3.castShadow = false
                        crate3.receiveShadow = false
                    }
                }

                if(objMesh.name == "Palette"){
                    palette = objMesh
                    palette.visible = !palette.visible
                    palette.castShadow = false
                    palette.receiveShadow = false
                }

                if(objMesh.name == "stoneBench"){
                    marbleMesh = objMesh
                    defaultTextureMarble = marbleMesh.material.map
                }

                if(objMesh.name.includes("Text")){
                    objMesh.visible = !objMesh.visible
                    if(objMesh.name == "TextAltura"){
                        textoAltura = objMesh
                    }
                    if(objMesh.name == "TextAlturaMeio"){
                        textoAlturaMeio = objMesh
                    }
                    if(objMesh.name == "TextAlturaExtensao"){
                        textoAlturaExtensao = objMesh
                    }
                    if(objMesh.name == "TextAlturaRecipiente"){
                        textoAlturaRecipiente = objMesh
                    }
                    if(objMesh.name == "TextLarguraCom2Portas"){
                        textoLarguraCom2Portas = objMesh
                    }
                    if(objMesh.name == "TextLarguraComExtensao"){
                        textoLarguraComExtensao = objMesh
                    }
                    if(objMesh.name == "TextLarguraSemExtensao"){
                        textoLarguraSemExtensao = objMesh
                    }
                    if(objMesh.name == "TextLarguraComPortaDireita"){
                        textoLarguraDireita = objMesh
                    }
                    if(objMesh.name == "TextLarguraComPortaEsquerda"){
                        textoLarguraEsquerda = objMesh
                    }
                    if(objMesh.name == "TextProfundidadePrincipal"){
                        textoProfundidadePrincipal = objMesh
                    }
                    if(objMesh.name == "TextProfundidadePortaDireita"){
                        textoProfundidadePortasDir = objMesh
                    }
                    if(objMesh.name == "TextProfundidadePortaEsquerda"){
                        textoProfundidadePortasEsq = objMesh
                    }
                }

                if(objMesh.name == "vaso1"){
                    vaso1 = objMesh
                    vaso1.visible = !vaso1.visible
                }
            })

            var BenchExtendOpen = THREE.AnimationClip.findByName(gltf.animations, "NlaBenchOpen") 
            var legExtendOpen = THREE.AnimationClip.findByName(gltf.animations, "NlaLegOpen")
            var RightDoor = THREE.AnimationClip.findByName(gltf.animations,"NlaRightDoor")
            var LeftDoor = THREE.AnimationClip.findByName(gltf.animations,"NlaLeftDoor")
            var vaso1animation = THREE.AnimationClip.findByName(gltf.animations, "NlaVaso1") 
            //var RopeAction = THREE.AnimationClip.findByName(gltf.animations,"NlaRopeAction")
            actionBenchExtendOpen = mixer.clipAction(BenchExtendOpen)
            actionLegExtendOpen = mixer.clipAction(legExtendOpen)
            actionLeftDoor = mixer.clipAction(RightDoor)
            actionRightDoor = mixer.clipAction(LeftDoor)
            actionVaso1 = mixer.clipAction(vaso1animation)
            //actionRopeAction = mixer.clipAction(RopeAction)

            var box = new THREE.BoxGeometry(0.1,0.1,0.1);
            var boxMaterial = new THREE.MeshBasicMaterial({color: "white"});
            cube = new THREE.Mesh(box,boxMaterial)
            cube.position.set(0,0,0)
            scene.add(cube)
            cube.add(workBenchGeometry);
            cube.add(legGeometry);
            cube.add(benchGeometry);
            cube.add(rightDoorGeometry);
            cube.add(leftDoorGeometry);
            cube.add(marbleMesh);
            cube.add(legStickGeometry);
        }
    )
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
    //DirLight.target.position.set(0,0,0)
    
    scene.add(DirLight)
    //scene.add(DirLight.target)

    renderer.toneMapping = THREE.ReinhardToneMapping;

    addBulb(500)
    //scene.add(new THREE.CameraHelper(DirLight.shadow.camera));
}

function addLightsMidDay(){

    scene.remove(bulbLight)
    scene.remove(DirLight)
    scene.background = new THREE.Color(0xC1EDFF) 
    
    DirLight.position.set(5,15,00);
    //DirLight.target.position.set(0,0,0)
    
    scene.add(DirLight)
    //scene.add(DirLight.target)

    renderer.toneMapping = THREE.ReinhardToneMapping;
    
    addBulb(0)
    //scene.add(new THREE.CameraHelper(DirLight.shadow.camera));
}

function addLightsDawn(){
    //scene.remove(DirLight)
    scene.remove(bulbLight)
    scene.background = new THREE.Color(0xFFE5CC) 
    
    DirLight.position.set(30,40,50);
    //DirLight.target.position.set(0,0,0)
    
    scene.add(DirLight)
    //scene.add(DirLight.target)

    renderer.toneMapping = THREE.ReinhardToneMapping;
    
    addBulb(400)
    //scene.add(new THREE.CameraHelper(DirLight.shadow.camera));
}

function resetCameraSmooth(){
    //camera.position.set(-2,8,15)
    smoothTransition(camera.position, {x:-2,y:8,z:15})
    setTimeout(function(){camera.lookAt(0,0,0)},1000)
    rotate = 0;
}

function resetCamera(){
    camera.position.set(-2,8,15)
    //smoothTransition(camera.position, {x:-2,y:8,z:15})
    camera.lookAt(0,0,0)
    rotate = 0;
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

 function actionButtons(){
     document.getElementById("btn_open").onclick = function (){
        //startTransition = 1

        if(rotate!=0){
            resetCamera()
        }
        smoothTransition({x:-2, y:8, z:15},{x:-7, y:9, z:7})

        if(is_BenchExtendOpen==0){
            actionBenchExtendOpen.reset()
            actionBenchExtendOpen.timeScale = 1
            actionBenchExtendOpen.setLoop(THREE.LoopOnce)
            actionBenchExtendOpen.clampWhenFinished = true
            actionBenchExtendOpen.play()
            is_BenchExtendOpen = 1
        }

        if(is_LegExtendOpen==0){
            actionLegExtendOpen.reset()
            actionLegExtendOpen.timeScale = 1
            actionLegExtendOpen.setLoop(THREE.LoopOnce)
            actionLegExtendOpen.clampWhenFinished = true
            actionLegExtendOpen.play()
            is_LegExtendOpen = 1
        }

    }

    document.getElementById("btn_close").onclick = async function (){
        //returnTransition = 1
        if(rotate!=0){
            resetCamera()
        }
        resetCameraSmooth()

        if(is_LegExtendOpen == 1){
            actionLegExtendOpen.timeScale = -1
            actionLegExtendOpen.setLoop(THREE.LoopOnce)
            actionLegExtendOpen.clampWhenFinished = false
            actionLegExtendOpen.paused = false
            actionLegExtendOpen.play()
            is_LegExtendOpen = 0;
        }

        if(is_BenchExtendOpen == 1){
            setTimeout(function(){
                actionBenchExtendOpen.timeScale = -1
                actionBenchExtendOpen.setLoop(THREE.LoopOnce)
                actionBenchExtendOpen.clampWhenFinished = false
                actionBenchExtendOpen.paused = false
                actionBenchExtendOpen.play()
                is_BenchExtendOpen = 0;
            },290)
        }

    }

    document.getElementById("btn_close_doors").onclick = function (){
        if(rotate!=0){
            resetCamera()
        }
       resetCameraSmooth()

        if(esq_aberta == 1 && dir_aberta == 0){
            actionLeftDoor.timeScale = -1
            actionLeftDoor.setLoop(THREE.LoopOnce)
            actionLeftDoor.clampWhenFinished = false
            actionLeftDoor.paused = false
            actionLeftDoor.play()
            esq_aberta=0;
        }

        if(esq_aberta == 0 && dir_aberta == 1){
            actionLeftDoor.timeScale = -1
            actionLeftDoor.setLoop(THREE.LoopOnce)
            actionLeftDoor.clampWhenFinished = false
            actionLeftDoor.paused = false
            actionLeftDoor.play()
            dir_aberta=0;
        }
        
        if(esq_aberta == 1 && dir_aberta == 1){
            actionLeftDoor.timeScale = -1
            actionLeftDoor.setLoop(THREE.LoopOnce)
            actionLeftDoor.clampWhenFinished = false
            actionLeftDoor.paused = false
            actionLeftDoor.play()

            actionRightDoor.timeScale = -1
            actionRightDoor.setLoop(THREE.LoopOnce)
            actionRightDoor.clampWhenFinished = false
            actionRightDoor.paused = false
            actionRightDoor.play()

            esq_aberta=0;
            dir_aberta=0;
        }

    }

    document.getElementById("btn_open_doors").onclick = function (){
        if(rotate!=0){
            resetCamera()
        }
        
        
        if(esq_aberta == 0 && dir_aberta == 1){
            resetCameraSmooth()
            smoothTransition({x:-2, y:8, z:15},{x:-1, y:5, z:10})
            actionLeftDoor.reset()
            actionLeftDoor.timeScale = 1
            actionLeftDoor.setLoop(THREE.LoopOnce)
            actionLeftDoor.clampWhenFinished = true
            actionLeftDoor.play()
            esq_aberta = 1;
        }

        if(esq_aberta == 1 && dir_aberta == 0){
            resetCameraSmooth()
            smoothTransition({x:-2, y:8, z:15},{x:-1, y:5, z:10})
            actionRightDoor.reset()
            actionRightDoor.timeScale = 1
            actionRightDoor.setLoop(THREE.LoopOnce)
            actionRightDoor.clampWhenFinished = true
            actionRightDoor.play()
            dir_aberta = 1;
        }

        if(esq_aberta == 0 && dir_aberta == 0){
            resetCameraSmooth()
            smoothTransition({x:-2, y:8, z:15},{x:-1, y:5, z:10})
            actionRightDoor.reset()
            actionRightDoor.timeScale = 1
            actionRightDoor.setLoop(THREE.LoopOnce)
            actionRightDoor.clampWhenFinished = true
            actionRightDoor.play()

            actionLeftDoor.reset()
            actionLeftDoor.timeScale = 1
            actionLeftDoor.setLoop(THREE.LoopOnce)
            actionLeftDoor.clampWhenFinished = true
            actionLeftDoor.play()

            dir_aberta = 1
            esq_aberta = 1
        }

    }

    document.getElementById("btn_open_left_door").onclick = function (){
        if(rotate!=0){
            resetCamera()
        }
        if(esq_aberta == 0){
            //smoothTransition(camera.position,{x:3, y:5, z:10})
            smoothTransition({x:-2, y:8, z:15},{x:3, y:5, z:10})
            if(is_BenchExtendOpen==0){
                camera.lookAt(-7,-3,0)
            }else{
                camera.lookAt(-9,4,0)
            }
            actionLeftDoor.reset()
            actionLeftDoor.timeScale = 1
            actionLeftDoor.setLoop(THREE.LoopOnce)
            actionLeftDoor.clampWhenFinished = true
            actionLeftDoor.play()
            esq_aberta = 1
        }
    }

    document.getElementById("btn_close_left_door").onclick = function (){
        if(rotate!=0){
            resetCameraSmooth()
        }
        if(esq_aberta == 1){
            resetCameraSmooth()
            actionLeftDoor.timeScale = -1
            actionLeftDoor.setLoop(THREE.LoopOnce)
            actionLeftDoor.clampWhenFinished = false
            actionLeftDoor.paused = false
            actionLeftDoor.play()
            esq_aberta = 0
        }
    }

    document.getElementById("btn_open_right_door").onclick = function (){
        if(rotate!=0){
            resetCamera()
        }
        if(dir_aberta == 0){
            smoothTransition({x:-2, y:8, z:15},{x:-2, y:5, z:10})
            camera.lookAt(7,-3,0)
            actionRightDoor.reset()
            actionRightDoor.timeScale = 1
            actionRightDoor.setLoop(THREE.LoopOnce)
            actionRightDoor.clampWhenFinished = true
            actionRightDoor.play()
            dir_aberta = 1
        }
    }

    document.getElementById("btn_close_right_door").onclick = function (){
        if(rotate!=0){
            resetCamera()
        }
        if(dir_aberta == 1){
            resetCameraSmooth()
            camera.lookAt(0,0,0)
            actionRightDoor.timeScale = -1
            actionRightDoor.setLoop(THREE.LoopOnce)
            actionRightDoor.clampWhenFinished = false
            actionRightDoor.paused = false
            actionRightDoor.play()
            dir_aberta = 0
        }
    }

    document.getElementById("btn_rotate").onclick = function (){
            if(startRotation==0 || startRotation==2){
                startRotation = 1
            }else{
                startRotation = 2
            }    
        /*if(rotate==0){
                resetCamera()
            }
            
            switch(rotate){
                case 0:
                    camera.position.set(-20,8,9) 
                    rotate+=1;
                    break;
                case 1:
                    camera.position.set(-16,8,-12)
                    rotate+=1;
                    break;
                case 2:
                    camera.position.set(-4,7,-16)
                    rotate+=1;
                    break;
                case 3:
                    camera.position.set(10,7,-15)
                    rotate+=1;
                    break;
                case 4:
                    camera.position.set(17,7,1)
                    rotate+=1;
                    break;
                case 5:
                   camera.position.set(12,7,10)
                    rotate+=1;
                    break;
                case 6:
                    camera.position.set(-2,8,15) 
                    rotate=0;
                    break;
            }
            camera.lookAt(0,0,0)*/


    }

    document.getElementById("btn_light").onclick = function (){
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

    document.getElementById("btn_reset_view").onclick = function(){
        resetCameraSmooth()
    }
    

    document.getElementById("btn_reset").onclick = function(){
        actionRightDoor.stop()
        actionLeftDoor.stop()
        actionBenchExtendOpen.stop()
        actionLegExtendOpen.stop()

        is_BenchExtendOpen = 0
        is_LegExtendOpen = 0
        is_DoorsOpen = 0
        startRotation = 2
    }
    
    document.getElementById("btn_stop").onclick = function(){
        if(pausa == 0){
            actionRightDoor.paused = true
            actionLeftDoor.paused = true
            actionBenchExtendOpen.paused = true
            actionLegExtendOpen.paused = true
           pausa = 1
       }else{
            actionRightDoor.paused = false
            actionLeftDoor.paused = false
            actionBenchExtendOpen.paused = false
            actionLegExtendOpen.paused = false
           pausa = 0
       }
   }

   document.getElementById("btn_texture").onclick = function(){
       if(changeTexture == 0){ //Se for para mudar atualizamos a camara, senão apenas faz os cubos desaparecer
            resetCamera(); 
            changeTexture = 1
        }else{
            changeTexture = 0
        }
        crate1.visible = !crate1.visible
        crate2.visible = !crate2.visible
        crate3.visible = !crate3.visible
        palette.visible = !palette.visible
    }

    document.getElementById("btn_show_dimensions").onclick = function(){
        if(mostrarDimensoes == 0){
            textoAltura.visible = true
            textoAlturaMeio.visible = true
            textoAlturaRecipiente.visible = true
            if(is_BenchExtendOpen==1){
                textoAlturaExtensao.visible = true
                textoLarguraComExtensao.visible = true
            }else{
                textoLarguraSemExtensao.visible = true
            }
            textoProfundidadePrincipal.visible = true
            if(dir_aberta == 1){
                textoProfundidadePortasDir.visible = true
                if(esq_aberta == 1){
                    textoLarguraCom2Portas.visible = true
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
            textoAltura.visible = false
            textoAlturaMeio.visible = false
            textoAlturaRecipiente.visible = false
            textoAlturaExtensao.visible = false
            textoLarguraComExtensao.visible = false
            textoLarguraSemExtensao.visible = false
            textoLarguraCom2Portas.visible = false
            textoLarguraDireita.visible = false
            textoLarguraEsquerda.visible = false
            textoProfundidadePrincipal.visible = false
            textoProfundidadePortasDir.visible = false
            textoProfundidadePortasEsq.visible = false
            mostrarDimensoes = 0
        }
    }

    document.getElementById("btn_show_objects").onclick = function (){
        vaso1.visible = !vaso1.visible
        if(animacao_vasos == 0){
            actionVaso1.reset()
            actionVaso1.timeScale = 1
            actionVaso1.setLoop(THREE.LoopOnce)
            actionVaso1.clampWhenFinished = true
            actionVaso1.play()

            animacao_vasos = 1;
        }else{
            animacao_vasos = 0;
        }
    }

}

window.onclick = function(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1 
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1  
    console.log("x: "+ mouse.x + "y: "+ mouse.y)
    pickCrateTexture()
}

function pickCrateTexture(){
    if(changeTexture == 1){
        raycaster.setFromCamera(mouse,camera)
        var intersectedCrates = raycaster.intersectObjects(cratesArray)
        console.log(intersectedCrates.length)
        if(intersectedCrates.length > 0){
            workBenchGeometry .material = intersectedCrates[0].object.material
            legGeometry.material = intersectedCrates[0].object.material
            legStickGeometry.material = intersectedCrates[0].object.material
            rightDoorGeometry.material = intersectedCrates[0].object.material
            leftDoorGeometry.material = intersectedCrates[0].object.material
            benchGeometry.material = intersectedCrates[0].object.material
            if(workBenchGeometry.material == cratesArray[2].material){
                const textureMarble = new THREE.TextureLoader().load('models/materials/blackMarble.JPG')
                textureMarble.flipY = false
                marbleMesh.material.map = textureMarble
            }else{
                marbleMesh.material.map = defaultTextureMarble
            }
        }
    }    
}
