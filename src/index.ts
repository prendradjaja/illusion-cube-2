import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Color,
  Float32BufferAttribute,
  Mesh,
  WebGLRenderer
} from "three";

// adapted from https://stackoverflow.com/a/70404932/1945088

let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let cube: Mesh;

init();

function init() {

  camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 4;

  scene = new Scene();

  const piece = new BoxGeometry(1, 1, 1).toNonIndexed();
  const material = new MeshBasicMaterial({
    vertexColors: true
  });
  const positionAttribute = piece.getAttribute('position');
  const colors = [];
  const myColors = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0x00ffff,
    0xff00ff,
    0xffff00,
  ];

  const color = new Color();

  for (let i = 0; i < positionAttribute.count; i += 6) {

    color.setHex(myColors.shift()!);

    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);

    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
  } // for

  // define the new attribute
  piece.setAttribute('color', new Float32BufferAttribute(colors, 3));

  cube = new Mesh(piece, material);
  scene.add(cube);

  cube.rotation.x = 0.5;
  cube.rotation.y = 0.5;

  renderer = new WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);

}
