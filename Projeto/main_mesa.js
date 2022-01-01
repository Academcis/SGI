var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(70, 800/600,0.01, 1000);
camera.position.set(-2,8,15);
camera.lookAt(0,0,0); //para onde quero apontar a camera (neste caso, para o centro)

var clock = new THREE.Clock();
var mixer = new THREE.AnimationMixer(scene);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var bulbLight = null, bulbMat = null;
var lampSphere = null;
var workBenchGeometry = null, rightDoorGeometry = null, leftDoorGeometry = null, benchGeometry = null, legGeometry = null, legStickGeometry = null
var crate1 = null, crate2 = null, crate3 = null, palette = null;
var cratesArray = [];
var changeTexture = 0;
var is_BenchExtendOpen = 0;
var is_LegExtendOpen = 0;
var is_DoorsOpen = 0;
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

var myCanvas = document.getElementById("myCanvas") //- não é preciso pois já tenho o appendChild do body

//var grid = new THREE.GridHelper()
//scene.add(grid)
//var axes = new THREE.AxesHelper(5) //tamanho dos eixos
//scene.add(axes)

var renderer = new THREE.WebGLRenderer({canvas:myCanvas})
renderer.setSize(545,400)
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio( window.devicePixelRatio );

new THREE.OrbitControls(camera, renderer.domElement) //ISTO ESTÁ BEM ASSIM?

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
    mixer.update(clock.getDelta())
    renderer.render(scene, camera)
}


function loadScene(){
    var loadBench = new THREE.GLTFLoader()
    loadBench.load( 
        'models/workBenchM_v2.gltf',
        function(gltf){
            scene.add(gltf.scene)
            gltf.scene.traverse(function(x){
                if (x instanceof THREE.Light) x.visible = false
                //scene.getObjectByName('Botao2').visible = false -> depois de ver na consola qual é o nome 
                //scene.getObjectByName('door').visible = true
            }) //para tornar invisivel a luz que possa existir a mais

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
                   // sphere.material.clipShadows = true
                }

              /*  if(objMesh.name == "LampPost"){
                    lampPost = objMesh
                    lampPost.castShadow = false
                   // sphere.material.clipShadows = true
                }*/

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
            })

            var BenchExtendOpen = THREE.AnimationClip.findByName(gltf.animations, "NlaBenchOpen") 
            var legExtendOpen = THREE.AnimationClip.findByName(gltf.animations, "NlaLegOpen")
            var RightDoor = THREE.AnimationClip.findByName(gltf.animations,"NlaRightDoor")
            var LeftDoor = THREE.AnimationClip.findByName(gltf.animations,"NlaLeftDoor")
            var RopeAction = THREE.AnimationClip.findByName(gltf.animations,"NlaRopeAction")
            //var cameraAction = THREE.AnimationClip.findByName(gltf.animations, "NlaCameraAction")
            actionBenchExtendOpen = mixer.clipAction(BenchExtendOpen)
            actionLegExtendOpen = mixer.clipAction(legExtendOpen)
            actionRightDoor = mixer.clipAction(RightDoor)
            actionLeftDoor = mixer.clipAction(LeftDoor)
            actionRopeAction = mixer.clipAction(RopeAction)
            //actionCameraAction = mixer.clipAction(cameraAction)
        }
    )
}

/*function animateLight(){
    const time = Date.now() * 0.0005;
    DirLight.position.x = Math.sin(time*0.07);
    DirLight.position.z = Math.cos(time*0.07);
    
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

function addLightsMidDay(){
    scene.background = new THREE.Color(0xC1EDFF) 
}*/

function addLightsNight(){
    scene.remove(DirLight)
    scene.remove(bulbLight)
    scene.background = new THREE.Color(0x272146) 
    
    //DirLight.position.set(-60,60,-200);
    //DirLight.target.position.set(0,0,0)
    
   //scene.add(DirLight)
    //scene.add(DirLight.target)

    renderer.toneMapping = THREE.ReinhardToneMapping;

    addBulb(1500)
    //scene.add(new THREE.CameraHelper(DirLight.shadow.camera));
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

function resetCamera(){
    camera.position.set(-2,8,15) 
    camera.lookAt(0,0,0)
    rotate = 0;
}

 function actionButtons(){
     document.getElementById("btn_open").onclick = function (){
        //let time = {t: 0};
        //var startQuaternion = camera.quaternion.clone() //set initial angle
        /*curvePath = new THREE.CurvePath();
        curvePath = findAPath(startingPoint, endingPoint, curvePath);

        
        curveGeometry = new THREE.Geometry();
        curveGeometry.vertices = curvePath.getPoints( 100 );
*/
        camera.position.set(-7,9,7) 
        camera.lookAt(-2,-2,-12)
      
        /*setTimeout(function(){
            camera.position.set(-3,8,14)
            camera.lookAt(-1,-1,-1)
        }, 1000)

        setTimeout(function(){
            camera.position.set(-4,8,13)
            camera.lookAt(-1,-1,-2)
        }, 1000)

        setTimeout(function(){
            camera.position.set(-5,8,12)
            camera.lookAt(-1,-1,-3)
        }, 1000)

        setTimeout(function(){
            camera.position.set(-5,8,11)
            camera.lookAt(-1,-1,-3)
        }, 1000)

        setTimeout(function(){
            camera.position.set(-5,8,10)
            camera.lookAt(-1,-1,-5)
        }, 1000)

        setTimeout(function(){
            camera.position.set(-6,8,9)
            camera.lookAt(-1,-1,-7)
        }, 1000)

        setTimeout(function(){
            camera.position.set(-7,9,7)
            camera.lookAt(-2,-2,-12)
        }, 1000)*/
/*
        for(var i=-2; i>-8;i--){
            for (var j=15;j>6;j--){
                for(var k = 0;k>-13;k--){
                setTimeout(function(){
                    camera.position.set(i,9,j)
                    camera.lookAt(-2,-2,k)
                }, 500)
                
                }
            }
        }

        camera.lookAt(-2,-2,-12)*/
        //var endQuaternion = camera.quaternion.clone() //set destination angle
        //camera.quaternion.copy(startQuaternion)

        /*new TWEEN.Tween(time)
        .to({t: 1}, 1000) //duration in milliseconds
        .onUpdate(() => {
            THREE.Quaternion.slerp(startQuaternion, endQuaternion, camera.quaternion, time.t);
        })
        .easing(TWEEN.Easing.Quadratic.InOut).onComplete(() => {*/
        /*actionCameraAction.reset()
        actionCameraAction.timeScale = 1
        actionCameraAction.setLoop(THREE.LoopOnce)
        actionCameraAction.clampWhenFinished = true
        actionCameraAction.play()*/

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

        /*
        actionRopeAction.reset()
        actionRopeAction.timeScale = 1
        actionRopeAction.setLoop(THREE.LoopOnce)
        actionRopeAction.clampWhenFinished = true
        actionRopeAction.play()*/

       // }).start();

    }

    document.getElementById("btn_close").onclick = async function (){
        camera.position.set(-2,8,15) 
        camera.lookAt(0,0,0)

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
        camera.position.set(-2,8,15) 
        camera.lookAt(0,0,0)
        
        if(is_DoorsOpen == 1){
            actionRightDoor.timeScale = -1
            actionRightDoor.setLoop(THREE.LoopOnce)
            actionRightDoor.clampWhenFinished = false
            actionRightDoor.paused = false
            actionRightDoor.play()
            
            actionLeftDoor.timeScale = -1
            actionLeftDoor.setLoop(THREE.LoopOnce)
            actionLeftDoor.clampWhenFinished = false
            actionLeftDoor.paused = false
            actionLeftDoor.play()
            is_DoorsOpen=0;
        }

    }

    document.getElementById("btn_open_doors").onclick = function (){
        camera.position.set(-1,5,10) 
        camera.lookAt(0,0,0)
        
        /*actionCameraAction.timeScale = -1
        actionCameraAction.setLoop(THREE.LoopOnce)
        actionCameraAction.clampWhenFinished = false
        actionCameraAction.paused = false
        actionCameraAction.play()*/

        if(is_DoorsOpen == 0){
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
            is_DoorsOpen = 1;
        }

    }

    document.getElementById("btn_rotate").onclick = function (){
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
               /* case 4:
                    camera.position.set(18,7,-6)
                    rotate+=1;
                    break;*/
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

        camera.lookAt(0,0,0)

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
        resetCamera();   
    }
    

    document.getElementById("btn_reset").onclick = function(){
        actionRightDoor.stop()
        actionLeftDoor.stop()
        actionBenchExtendOpen.stop()
        actionLegExtendOpen.stop()

        is_BenchExtendOpen = 0
        is_LegExtendOpen = 0
        is_DoorsOpen = 0
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
        }
    }    
}
