import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matCapTexture = textureLoader.load('textures/matcaps/2.png');
const cloudTexture = textureLoader.load('textures/cloud.png');


// Clouds
// const cloudGeometry = new THREE.BoxGeometry(2,2,2);
const cloudGeometry = new THREE.PlaneGeometry(64, 64);
const cloudMaterial = new THREE.MeshLambertMaterial({map: cloudTexture, transparent: true, opacity: 0.5});

for(let i=0; i<8000; i++) {

    let cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

    // cloud.position.set(x,y,z);
    cloud.position.set(
        (Math.random() * 1000) - 500,
        -Math.random() * (Math.random() * 200) - 15,
        i
    );
    cloud.scale.x = cloud.scale.y = Math.random() * Math.random() * 1.5 + 0.5
    cloud.rotation.z = Math.random() * Math.PI;
    scene.add(cloud);
}



/**
 * Fonts
 */
const fontLoader = new FontLoader();
const title = `Utkarsh
and the
Portfolio`;
fontLoader.load('/fonts/Harry_P_Regular.json', (font) => {

    console.log('font', font)
    const nameText = new TextGeometry(
        title, {
            font,
            size: 5,
            height:0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        }
    );
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture});
    const text1 = new THREE.Mesh(nameText, textMaterial);
    
    text1.scale.x = 4
    text1.scale.y = 4
    text1.position.z = 4000;
    // text1.position.y = -Math.random() * (Math.random() * 200) / 2
    // text1.position.z = 5000
    // const text2 = new THREE.Mesh(secondLineText, textMaterial);
    // const text3 = new THREE.Mesh(thirdLineText, textMaterial);
    nameText.computeBoundingBox();
    nameText.center();
    scene.add(text1)

})

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0x1D2430, 0.7);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);

let flash = new THREE.PointLight(0x7DF9FF, 0.5);
gui.add(flash.position, 'x').min(-300).max(300).step(10);
gui.add(flash.position, 'y').min(-300).max(300).step(10);
gui.add(flash.position, 'z').min(-100).max(8000).step(100);
// flash.position.set(0, 0, 8000)

scene.add(ambientLight,flash)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 1, 3000)
// camera.position.x = 1
// camera.position.y = -Math.random() * (Math.random() * 200) / 2
camera.position.z = 3000
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update();
    // camera.position.z -= elapsedTime * 0.01;

    if(Math.random() > 0.98) {
        flash.power = (Math.random() * 10) + 50;
        flash.position.z = Math.random() * 4000;
        console.log(flash.power)
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()