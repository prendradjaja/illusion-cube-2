import {
  BoxGeometry,
  Camera,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";

const randomHues = [195, 234, 294, 166, 263, 291, 327, 312, 224, 34, 36, 188, 308, 122, 58, 87, 318, 135, 282, 143, 244, 187, 89, 88, 142, 208, 176, 339, 283, 159, 131, 356, 57, 0, 147, 52, 288, 270, 99, 343, 219, 165, 123, 309, 329, 77, 304, 271, 120, 359, 281, 64, 211, 60, 301, 154, 23, 336, 80, 306, 260, 276, 75, 344, 199, 302, 296, 277, 218, 214, 37, 48, 334, 74, 358, 245, 17, 238, 46, 285, 193, 71, 315, 292, 180, 126, 212, 287, 31, 261, 313, 323, 40, 93, 322, 56, 84, 240, 168, 269, 268, 94, 333, 196, 280, 185, 272, 223, 44, 112, 141, 200, 241, 202, 310, 32, 231, 146, 297, 236, 160, 217, 173, 19, 338, 248, 25, 232, 161, 148, 349, 174, 116, 113, 24, 30, 33, 70, 96, 345, 324, 307, 253, 136, 91, 97, 330, 194, 354, 357, 254, 85, 266, 13, 11, 1, 105, 197, 98, 311, 55, 284, 215, 184, 342, 62, 326, 39, 230, 355, 239, 41, 183, 9, 337, 247, 172, 109, 14, 125, 107, 10, 207, 170, 267, 104, 133, 198, 273, 192, 340, 167, 128, 86, 83, 28, 45, 12, 191, 111, 189, 26, 293, 153, 73, 252, 137, 325, 150];
const randomLightnesses = [51, 42, 39, 26, 37, 71, 73, 36, 25, 53, 57, 75, 60, 33, 74, 40, 72, 55, 54, 68, 50, 64, 30, 35, 65, 62, 32, 69, 29, 48, 31, 34, 38, 41, 49, 43, 61, 28, 27, 63, 52, 67, 59, 58, 66, 45, 44, 56, 47];

const stickerSize = 0.85;
const stickerThickness = 0.01;

let camera: Camera;
let scene: Scene;
let renderer: WebGLRenderer;

main();

function main() {
  scene = new Scene();

  // Set up camera
  camera = new OrthographicCamera(...calculateViewingFrustum());
  /* camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10); */
  camera.position.set(4, 4, 4);
  camera.lookAt(0, 0, 0)

  // Set up renderer
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor('gray')
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Draw cube
  const cubies: Group[] = [];
  for (let x of [-1, 0, 1]) {
    for (let y of [-1, 0, 1]) {
      for (let z of [-1, 0, 1]) {
        const cubie = createCubie({x, y, z});
        cubies.push(cubie);
        scene.add(cubie);
      }
    }
  }

  // Turn a side
  turn(cubies, 0, 1, Math.PI / 8)

  // Render
  renderer.render(scene, camera);
}

function turn(
  allCubies: Group[],
  axis: 0 | 1 | 2,
  slice: -1 | 0 | 1,
  angle: number
) {
  const axisVector = new Vector3(0, 0, 0);
  axisVector.setComponent(axis, 1);

  // Find the cubies that should be involved in the turn
  const cubies = allCubies.filter(
    cubie =>
      floatEquals(
        cubie.position.getComponent(axis),
        slice
      )
  );

  // Turn them
  for (let cubie of cubies) {
    cubie.position.applyAxisAngle(axisVector, angle);
    cubie.rotateOnWorldAxis(axisVector, angle);
  }
}

function floatEquals(a: number, b: number, epsilon = 0.00001) {
  return Math.abs(a - b) < epsilon;
}

function createCubie(position: {x: number, y: number, z: number}): Group {
  const result = new Group();
  result.position.set(position.x, position.y, position.z)

  // Create the black "base"
  const base = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 'black' })
  );
  base.position.set(0, 0, 0);
  result.add(base);

  // Add sticker(s) (up to three, depending on which cubie this is)
  for (let [i, dim] of (['x','y','z'] as const).entries()) {
    if (Math.abs(position[dim]) === 1) {
      let sizes = [stickerSize, stickerSize, stickerSize];
      sizes[i] = stickerThickness
      const sticker = new Mesh(
        new BoxGeometry(...sizes),
        new MeshBasicMaterial({ color: randomColor() })
      );
      const stickerPosition = [0, 0, 0] as [number, number, number]
      stickerPosition[i] = position[dim] * 0.5;
      sticker.position.set(...stickerPosition)
      result.add(sticker)
    }
  }

  return result;
}

function randomColor() {
  const hue = randomHues.shift() ?? 0;
  const lightness = randomLightnesses.shift() ?? 50;
  return `hsl(${hue}, 100%, ${lightness}%)`;
}

function calculateViewingFrustum(): [number, number, number, number, number, number] {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const viewingWindow = { // Not sure what the right terminology is here
    width: 10 * aspectRatio,
    height: 10
  };
  return [
    viewingWindow.width / -2,
    viewingWindow.width / 2,
    viewingWindow.height / 2,
    viewingWindow.height / -2,
    1,
    100,
  ];
}
