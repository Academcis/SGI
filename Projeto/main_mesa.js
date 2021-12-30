
var scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFE5CC) 

var camera = new THREE.PerspectiveCamera(70, 800/600,0.01, 1000)
camera.position.set(-2,8,15)
camera.lookAt(0,0,0) //para onde quero apontar a camera (neste caso, para o centro)

var clock = new THREE.Clock()
var mixer = new THREE.AnimationMixer(scene)

var rotate=0;

//var actionBenchExtendDown = null
var actionBenchExtendOpen = null
var actionLegExtendOpen = null
var actionRopeAction = null
var actionBenchExtendOpenReverse = null

var myCanvas = document.getElementById("myCanvas") //- não é preciso pois já tenho o appendChild do body

//var grid = new THREE.GridHelper()
//scene.add(grid)
//var axes = new THREE.AxesHelper(5) //tamanho dos eixos
//scene.add(axes)

var renderer = new THREE.WebGLRenderer({canvas:myCanvas})
renderer.setSize(545,400)
renderer.shadowMap.enabled = true

new THREE.OrbitControls(camera, renderer.domElement)

loadScene()
animate()
addlights()
actionButtons()

function animate(){
    requestAnimationFrame(animate)
    mixer.update(clock.getDelta())
    renderer.render(scene, camera)
}


function loadScene(){
    var loadBench = new THREE.GLTFLoader()
    loadBench.load( 
        'this_tentativa_background/workBenchM_v2.gltf',
        function(gltf){
            scene.add(gltf.scene)
            gltf.scene.traverse(function(x){
                //if (x instanceof THREE.Light) x.visible = false
                //scene.getObjectByName('Botao2').visible = false -> depois de ver na consola qual é o nome 
                //scene.getObjectByName('door').visible = true
            }) //para tornar invisivel a luz que possa existir a mais



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
    /*var scenario = new THREE.GLTFLoader()
    scenario.load( 
        'this_tentativa_background/scenario.gltf',
        function(gltf){
            scene.add(gltf.scene)
            gltf.scene.traverse(function(x){
                //if (x instanceof THREE.Light) x.visible = false
                //scene.getObjectByName('Botao2').visible = false -> depois de ver na consola qual é o nome 
                //scene.getObjectByName('door').visible = true
            }) 
            scenario.rotateY(180)
            scenario.position.set(-6,2,9)
            scenario.scale(150, 150)
        }
    )*/
}


function addlights(){
    var ambientL = new THREE.AmbientLight(0xffffff,1)
    scene.add(ambientL)

    var light = new THREE.DirectionalLight(0xFFFFFF,1)
    light.position.set(0,1,10)
    scene.add(light)
    /*var ambientLight = new THREE.AmbientLight("white", 2.2) //nunca mostra sombras, ilumina para todos os lados de igual forma
    scene.add(ambientLight)

    //Sem ser o ambientLigth, se existisse um objeto que tapa a luz a partir do ponto onde coloco-a, ficava preto
    var pointLight = new THREE.PointLight("white")
    pointLight.position.set(10,6,0)
    pointLight.castShadow = true
    scene.add(pointLight)*/
}

 function actionButtons(){
     document.getElementById("btn_open").onclick = function (){
        //let time = {t: 0};
        var startingPoint = (-2,8,15)
        var endingPoint = (-7,9,7) 
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

        actionBenchExtendOpen.reset()
        actionBenchExtendOpen.timeScale = 1
        actionBenchExtendOpen.setLoop(THREE.LoopOnce)
        actionBenchExtendOpen.clampWhenFinished = true
        actionBenchExtendOpen.play()

        actionLegExtendOpen.reset()
        actionLegExtendOpen.timeScale = 1
        actionLegExtendOpen.setLoop(THREE.LoopOnce)
        actionLegExtendOpen.clampWhenFinished = true
        actionLegExtendOpen.play()

        actionRopeAction.reset()
        actionRopeAction.timeScale = 1
        actionRopeAction.setLoop(THREE.LoopOnce)
        actionRopeAction.clampWhenFinished = true
        actionRopeAction.play()

       // }).start();

    }

    document.getElementById("btn_close").onclick = async function (){
        camera.position.set(-2,8,15) 
        camera.lookAt(0,0,0)
        
        /*actionCameraAction.timeScale = -1
        actionCameraAction.setLoop(THREE.LoopOnce)
        actionCameraAction.clampWhenFinished = false
        actionCameraAction.paused = false
        actionCameraAction.play()*/

        actionLegExtendOpen.timeScale = -1
        actionLegExtendOpen.setLoop(THREE.LoopOnce)
        actionLegExtendOpen.clampWhenFinished = false
        actionLegExtendOpen.paused = false
        actionLegExtendOpen.play()

        setTimeout(function(){

        actionBenchExtendOpen.timeScale = -1
        actionBenchExtendOpen.setLoop(THREE.LoopOnce)
        actionBenchExtendOpen.clampWhenFinished = false
        actionBenchExtendOpen.paused = false
        actionBenchExtendOpen.play()},290)

    }

    document.getElementById("btn_close_doors").onclick = function (){
        camera.position.set(-2,8,15) 
        camera.lookAt(0,0,0)
        

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

    }

    document.getElementById("btn_open_doors").onclick = function (){
        camera.position.set(-1,5,10) 
        camera.lookAt(0,0,0)
        
        /*actionCameraAction.timeScale = -1
        actionCameraAction.setLoop(THREE.LoopOnce)
        actionCameraAction.clampWhenFinished = false
        actionCameraAction.paused = false
        actionCameraAction.play()*/

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
        
        //camera.position.set(-20,8,9) 
        //camera.position.set(-20,8,-10) 
        //camera.position.set(-16,8,-12) 
        //camera.position.set(-10,8,-16)
        camera.lookAt(0,0,0)
        /*actionCameraAction.timeScale = -1
        actionCameraAction.setLoop(THREE.LoopOnce)
        actionCameraAction.clampWhenFinished = false
        actionCameraAction.paused = false
        actionCameraAction.play()*/

    }


    /* document.getElementById("btn_pause").onclick = function(){
        // actionBenchExtendDown.paused = !actionBenchExtendDown.paused  //fica no estado contrário do que estava
         actionBenchExtendOpen.paused = !actionBenchExtendOpen.paused
     }

     document.getElementById("btn_stop").onclick = function(){
         //actionBenchExtendDown.stop()
         actionBenchExtendOpen.stop()
     }

     document.getElementById("btn_reverse").onclick = function(){
        // actionBenchExtendDown.timeScale = -actionBenchExtendDown.timeScale
         actionBenchExtendOpen.timeScale = -actionBenchExtendOpen.timeScale
     }

     document.getElementById("menu_loop").onclick = function(){
         switch(this.value){ 
             case "1"://once
                 //actionBenchExtendDown.setLoop(THREE.LoopOnce)
                 //actionBenchExtendDown.clampWhenFinished = true //para quando se faz play, para ele ficar no frame onde acaba (para nao fazer reset)
                 actionBenchExtendOpen.setLoop(THREE.LoopOnce)
                 actionBenchExtendOpen.clampWhenFinished = true //por default isto está a false
                 break;
            
             case "2"://loop
                 //actionBenchExtendDown.setLoop(THREE.LoopRepeat)
                 actionBenchExtendOpen.setLoop(THREE.LoopRepeat)
                 break;
            
             case "3"://boomerang
                 //actionBenchExtendDown.setLoop(THREE.LoopPingPong)
                 actionBenchExtendOpen.setLoop(THREE.LoopPingPong)
                 break;
         }
     }*/
}
