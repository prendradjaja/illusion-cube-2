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
import { Tween, Easing, update as updateAllTweens } from "@tweenjs/tween.js";
import { MoveDefinition, moveDefinitions } from "./move-definitions";

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

let lastTween: Tween<{ progress: number }>;

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

  // Render first frame
  renderer.render(scene, camera);

  // Animation loop
  requestAnimationFrame(function animate(time) {
    requestAnimationFrame(animate);
    updateAllTweens(time);

    // In principle, we could render on every frame like this. But that seems
    // wasteful, so I'm avoiding that! Instead, by calling render() inside
    // onProgress(), I only render while tweening (i.e. while making a turn).
    // Probably not a big deal though -- normal fully-animated scenes need to
    // render on every frame anyway.

    // renderer.render(scene, camera);
  });

  // Handle keypresses
  document.addEventListener('keydown', (evt: KeyboardEvent) => onKeyDown(evt, cubies));
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

function onKeyDown(evt: KeyboardEvent, allCubies: Group[]): void {
  let move: MoveDefinition;

  if (evt.key === 'j' || evt.key === 'ArrowDown') {
    move = moveDefinitions.Ri;
  } else if (evt.key === 'k' || evt.key === 'ArrowUp') {
    move = moveDefinitions.R;
  } else if (evt.key === 'h' || evt.key === 'ArrowLeft') {
    move = moveDefinitions.Ui;
  } else if (evt.key === 'l' || evt.key === 'ArrowRight') {
    move = moveDefinitions.U;
  } else {
    return;
  }

  if (lastTween) {
    // If the most recent tween is still in progress, we want to skip to the
    // end.
    lastTween.stop();
  }

  let lastProgress = 0;

  const onProgress = ({ progress }: { progress: number }) => {
    const { axis, slice, direction } = move;
    const progressDelta = progress - lastProgress;
    lastProgress = progress;
    const angle = direction * progressDelta * Math.PI / 2;
    turn(allCubies, axis, slice, angle)
    renderer.render(scene, camera);
  }

  const tween = new Tween({ progress: 0 })
    .to({ progress: 1 }, 250)
    .easing(Easing.Quadratic.Out)
    .onUpdate(({ progress }) => onProgress({ progress }))
    .onComplete(() => onProgress({ progress: 1 })) // Do I need onComplete? Surely it's covered by onUpdate
    .onStop(() => onProgress({ progress: 1 }))
  tween.start();
  lastTween = tween;
};

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
