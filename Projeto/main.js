var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(50,600/400,0.01,500)
camera.position.set(8,3,1)
camera.lookAt(0,0,0)

var myCanvas = document.getElementById("meuCanvas")

var clock = new THREE.Clock()
var mixer = new THREE.AnimationMixer(scene) 

var actionFlag = null

//var grid = new THREE.GridHelper()
//scene.add(grid)
//var axes = new THREE.AxesHelper(5)
//scene.add(axes)


var renderer = new THREE.WebGLRenderer({canvas:myCanvas})
renderer.setSize(600,400)
renderer.shadowMap.enabled = true


new THREE.OrbitControls(camera,renderer.domElement)

loadScene()
addLights()
animate()
actionButtons()

function animate(){
    requestAnimationFrame(animate)
    mixer.update(clock.getDelta() )
    renderer.render(scene, camera)
    
}


function loadScene(){
    var loadCube = new THREE.GLTFLoader()
    loadCube.load(
        'models/flag.gltf',
        function(gltf){
            scene.add(gltf.scene)
            
            gltf.scene.traverse(function(x) {
                if (x instanceof THREE.Light) x.visible = false})
            //escondo a mesh com o nome "Cube"
            //scene.getObjectByName('Cubo').visible = false

            scene.traverse( function (objMesh) {
                if(objMesh.isMesh){
                    objMesh.castShadow = true
                    objMesh.receiveShadow = true
                }
            })

            var clipLocY = THREE.AnimationClip.findByName(gltf.animations,"KeyAction")
            actionFlag = mixer.clipAction(clipLocY)
            
        }
    )
}

function addLights(){
    var ambientLight = new THREE.AmbientLight("white")
    scene.add(ambientLight)

    var LightPoint1 = new THREE.PointLight("white")
    LightPoint1.position.set(5,6,0)
    LightPoint1.castShadow = true
    scene.add(LightPoint1)
}

function actionButtons(){
    document.getElementById("btn_play").onclick = function(){
        actionFlag.play()
    }

    document.getElementById("btn_stop").onclick = function(){
        actionFlag.stop()
    }

    document.getElementById("btn_pause").onclick = function(){
        actionFlag.paused = !actionFlag.paused
    }

}