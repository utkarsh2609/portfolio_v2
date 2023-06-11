import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Audio
const thunder = new Audio("cloud_thunder.mpeg");

const playSound = () => {
  thunder.play();
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("textures/Ice_001/Ice_001_COLOR.jpg");
const normalTexture = textureLoader.load("textures/Ice_001/Ice_001_NRM.jpg");
const occTexture = textureLoader.load("textures/Ice_001/Ice_001_OCC.jpg");
const specTexture = textureLoader.load("textures/Ice_001/Ice_001_SPEC.jpg");
const dispTexture = textureLoader.load("textures/Ice_001/Ice_001_DIPS.jpg");
// const matCapTexture = textureLoader.load('textures/matcaps/3.png');
const cloudTexture = textureLoader.load("textures/cloud.png");

// Clouds
// const cloudGeometry = new THREE.BoxGeometry(2,2,2);
const cloudGeometry = new THREE.PlaneGeometry(64, 64);
const cloudMaterial = new THREE.MeshLambertMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.5,
});

for (let i = 0; i < 8000; i++) {
  let cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

  // cloud.position.set(x,y,z);
  cloud.position.set(
    Math.random() * 1000 - 500,
    -Math.random() * (Math.random() * 200) - 15,
    i
  );
  cloud.scale.x = cloud.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
  cloud.rotation.z = Math.random() * Math.PI;
  scene.add(cloud);
}

/**
 * Fonts
 */
const fontLoader = new FontLoader();
const title = `Utkarsh`;
const subTitle = `and the 
Portfolio`;
let titleObj = {
  size: 5,
  height: 0.2,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 5,
};
fontLoader.load("/fonts/Harry_P_Regular.json", (font) => {
  const nameText = new TextGeometry(title, {
    font,
    ...titleObj,
  });
  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: specTexture,
    //  normalMap: normalTexture
  });
  const text1 = new THREE.Mesh(nameText, textMaterial);

  text1.scale.x = 2.5;
  text1.scale.y = 2.5;
  text1.position.z = 4000;
  nameText.computeBoundingBox();
  nameText.center();
  scene.add(text1);
  gui.add(text1.scale, "x").min(1).max(5).step(0.1).name("titleX");
  gui.add(text1.scale, "y").min(1).max(5).step(0.1).name("titleY");
});

fontLoader.load("/fonts/Lumos_Caps.json", (font) => {
  const nameText = new TextGeometry(subTitle, {
    font,
    size: 3,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: specTexture });
  const text1 = new THREE.Mesh(nameText, textMaterial);

  text1.scale.x = 1;
  text1.scale.y = 1;
  text1.position.x = 22;
  text1.position.y = -11.5;
  text1.position.z = 4000;
  nameText.computeBoundingBox();
  nameText.center();
  scene.add(text1);
  // gui.add(text1.scale, 'x').min(1).max(5).step(0.1).name('subTextX');
  // gui.add(text1.scale, 'y').min(1).max(5).step(0.1).name('subTextY');
  gui.add(text1.position, "x").min(-30).max(30).step(0.1).name("subTextPosX");
  gui.add(text1.position, "y").min(-50).max(10).step(0.1).name("subTextPosY");
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0x1d2430, 0.7);
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);

let flash = new THREE.PointLight(0x7df9ff, 0.5);
// gui.add(flash.position, 'x').min(-300).max(300).step(10);
// gui.add(flash.position, 'y').min(-300).max(300).step(10);
// gui.add(flash.position, 'z').min(-100).max(8000).step(100);
// flash.position.set(0, 0, 8000)

scene.add(ambientLight, flash);

/**
 * Snitch
 */
let mixer;

const gltfLoader = new GLTFLoader();

gltfLoader.load("/models/golden_snitch/scene.gltf", (gltf) => {
    gltf.scene.scale.set(0.025, 0.025, 0.025)
    scene.add(gltf.scene);

    mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  30,
  sizes.width / sizes.height,
  1,
  3000
);
// camera.position.x = 1
// camera.position.y = -Math.random() * (Math.random() * 200) / 2
camera.position.z = 3000;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if(mixer)
    {
        mixer.update(deltaTime)
    }

  // Update controls
  controls.update();
  // camera.position.z -= elapsedTime * 0.01;

  if (Math.random() > 0.98) {
    flash.power = Math.random() * 10 + 50;
    flash.position.z = Math.random() * 4000;
    console.log(flash.power);
    playSound();
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
