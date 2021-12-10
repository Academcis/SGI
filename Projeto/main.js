var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(70, 800/600,0.01, 1000)
camera.position.set(6,4,7) //em vez de fazer camera.position.z=3 para x, y e z 
camera.lookAt(0,0,0) //para onde quero apontar a camera (neste caso, para o centro)

//document.body.appendChild(renderer.domElement)

var clock = new THREE.Clock()
var mixer = new THREE.AnimationMixer(scene)

//var actionBenchExtendDown = null
var actionBenchExtendAction = null

var myCanvas = document.getElementById("myCanvas") //- não é preciso pois já tenho o appendChild do body

//var grid = new THREE.GridHelper()
//scene.add(grid)
//var axes = new THREE.AxesHelper(5) //tamanho dos eixos
//scene.add(axes)

var renderer = new THREE.WebGLRenderer({canvas:myCanvas})
renderer.setSize(800,600)
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
        'this_tentativa_background/workBenchM.gltf',
        function(gltf){
            scene.add(gltf.scene)
            gltf.scene.traverse(function(x){
                if (x instanceof THREE.Light) x.visible = false
                //scene.getObjectByName('Botao2').visible = false -> depois de ver na consola qual é o nome 
                //scene.getObjectByName('door').visible = true
            }) //para tornar invisivel a luz que possa existir a mais

            var benchExtendAction = THREE.AnimationClip.findByName(gltf.animations, "benchExtendAction") 
            actionBenchExtendAction = mixer.clipAction(benchExtendAction)

            // var benchExtendDown = THREE.AnimationClip.findByName(gltf.animations, "benchExtendDown") 
            // actionBenchExtendDown = mixer.clipAction(benchExtendDown)
        }
    )
}


function addlights(){
    var ambientLight = new THREE.AmbientLight("white", 2.2) //nunca mostra sombras, ilumina para todos os lados de igual forma
    scene.add(ambientLight)

    //Sem ser o ambientLigth, se existisse um objeto que tapa a luz a partir do ponto onde coloco-a, ficava preto
    var pointLight = new THREE.PointLight("white")
    pointLight.position.set(10,6,0)
    pointLight.castShadow = true
    scene.add(pointLight)
}

 function actionButtons(){
     document.getElementById("btn_play").onclick = function (){
         //actionBenchExtendDown.play()
         actionBenchExtendAction.play()
     }

     document.getElementById("btn_pause").onclick = function(){
        // actionBenchExtendDown.paused = !actionBenchExtendDown.paused  //fica no estado contrário do que estava
         actionBenchExtendAction.paused = !actionBenchExtendAction.paused
     }

     document.getElementById("btn_stop").onclick = function(){
         //actionBenchExtendDown.stop()
         actionBenchExtendAction.stop()
     }

     document.getElementById("btn_reverse").onclick = function(){
        // actionBenchExtendDown.timeScale = -actionBenchExtendDown.timeScale
         actionBenchExtendAction.timeScale = -actionBenchExtendAction.timeScale
     }

     document.getElementById("menu_loop").onclick = function(){
         switch(this.value){ 
             case "1"://once
                 //actionBenchExtendDown.setLoop(THREE.LoopOnce)
                 //actionBenchExtendDown.clampWhenFinished = true //para quando se faz play, para ele ficar no frame onde acaba (para nao fazer reset)
                 actionBenchExtendAction.setLoop(THREE.LoopOnce)
                 actionBenchExtendAction.clampWhenFinished = true //por default isto está a false
                 break;
            
             case "2"://loop
                 //actionBenchExtendDown.setLoop(THREE.LoopRepeat)
                 actionBenchExtendAction.setLoop(THREE.LoopRepeat)
                 break;
            
             case "3"://boomerang
                 //actionBenchExtendDown.setLoop(THREE.LoopPingPong)
                 actionBenchExtendAction.setLoop(THREE.LoopPingPong)
                 break;
         }
     }
}
