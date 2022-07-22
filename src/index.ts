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

const stickerColors = {
  'x=1': 'red',
  'x=-1': 'orange',
  'y=1': 'white',
  'y=-1': 'yellow',
  'z=1': 'green',
  'z=-1': 'blue',
} as Partial<Record<string, string>>;

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
      const color = stickerColors[`${dim}=${position[dim]}`] ?? 'gray'
      const sticker = new Mesh(
        new BoxGeometry(...sizes),
        new MeshBasicMaterial({ color })
      );
      const stickerPosition = [0, 0, 0] as [number, number, number]
      stickerPosition[i] = position[dim] * 0.5;
      sticker.position.set(...stickerPosition)
      result.add(sticker)
    }
  }

  return result;
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
