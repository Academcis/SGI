var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(70, 800/600,0.01, 1000)
camera.position.set(6,4,7) //em vez de fazer camera.position.z=3 para x, y e z 
camera.lookAt(0,0,0) //para onde quero apontar a camera (neste caso, para o centro)

//document.body.appendChild(renderer.domElement)

var clock = new THREE.Clock()
var mixer = new THREE.AnimationMixer(scene)

var actionLeftDoorAction = null
var actionRigthDoorAction = null

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


function loadScene(){
    var loadBench = new THREE.GLTFLoader()
    loadBench.load( 
        'models/movelJardinagem_v3.gltf',
        function(gltf){
            scene.add(gltf.scene)
            gltf.scene.traverse(function(x){
                if (x instanceof THREE.Light) x.visible = false
                //scene.getObjectByName('Botao2').visible = false -> depois de ver na consola qual é o nome 
                //scene.getObjectByName('door').visible = true
            }) //para tornar invisivel a luz que possa existir a mais

            var leftDoorAction = THREE.AnimationClip.findByName(gltf.animations, "NlaLeftDoorAction") 
            var rightDoorAction = THREE.AnimationClip.findByName(gltf.animations, "NlaRigthDoorAction") 
            actionLeftDoorAction = mixer.clipAction(leftDoorAction)
            actionRigthDoorAction = mixer.clipAction(rightDoorAction)
        }
    )
}

function animate(){
    requestAnimationFrame(animate)
    mixer.update(clock.getDelta())
    renderer.render(scene, camera)
}


function addlights(){
    var ambientLight = new THREE.AmbientLight("white", 0.45) //nunca mostra sombras, ilumina para todos os lados de igual forma
    scene.add(ambientLight)

    //Sem ser o ambientLigth, se existisse um objeto que tapa a luz a partir do ponto onde coloco-a, ficava preto
    var pointLight = new THREE.PointLight("white")
    pointLight.position.set(10,6,0)
    pointLight.castShadow = true
    scene.add(pointLight)
}


 function actionButtons(){
     document.getElementById("btn_left_door_open").onclick = function (){
         //actionBenchExtendDown.play()
         actionLeftDoorAction.play()
         actionLeftDoorAction.setLoop(THREE.LoopOnce)
         actionLeftDoorAction.clampWhenFinished = true //por default isto está a false
     }

     document.getElementById("btn_left_door_close").onclick = function(){
        // actionBenchExtendDown.paused = !actionBenchExtendDown.paused  //fica no estado contrário do que estava
       // actionLeftDoorAction.play() = -actionLeftDoorAction.play()
        actionLeftDoorAction.timeScale = -actionLeftDoorAction.timeScale
        actionLeftDoorAction.setLoop(THREE.LoopOnce)
        actionLeftDoorAction.clampWhenFinished = true
     }

     document.getElementById("btn_right_door_open").onclick = function () {
         actionRigthDoorAction.play()
         actionRigthDoorAction.setLoop(THREE.LoopOnce)
         actionRigthDoorAction.clampWhenFinished = true
     }

     document.getElementById("btn_right_door_close").onclick = function () {
         actionRigthDoorAction.timeScale = -actionLeftDoorAction.timeScale
         actionRigthDoorAction.setLoop(THREE.LoopOnce)
         actionRigthDoorAction.clampWhenFinished = true
     }

    document.getElementById("btn_stop").onclick = function(){
        //actionBenchExtendDown.stop()
        actionLeftDoorAction.stop()
    }
    document.getElementById("btn_pause").onclick = function(){
        actionLeftDoorAction.paused = !actionLeftDoorAction.paused
        actionRigthDoorAction.paused = !actionRigthDoorAction.paused
    }

    document.getElementById("btn_reverse").onclick = function(){
        actionLeftDoorAction.timeScale = -actionLeftDoorAction.timeScale
        
    }

    document.getElementById("menu_loop").onclick = function(){
        switch(this.value){ 
            case "1"://once
                //actionBenchExtendDown.setLoop(THREE.LoopOnce)
                //actionBenchExtendDown.clampWhenFinished = true //para quando se faz play, para ele ficar no frame onde acaba (para nao fazer reset)
                actionLeftDoorAction.setLoop(THREE.LoopOnce)
                actionLeftDoorAction.clampWhenFinished = true //por default isto está a false
                break;
        
            case "2"://loop
                //actionBenchExtendDown.setLoop(THREE.LoopRepeat)
                actionLeftDoorAction.setLoop(THREE.LoopRepeat)
                break;
        
            case "3"://boomerang
                //actionBenchExtendDown.setLoop(THREE.LoopPingPong)
                actionLeftDoorAction.setLoop(THREE.LoopPingPong)
                break;
        }
    }
}
