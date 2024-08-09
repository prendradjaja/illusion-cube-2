import {
  BoxGeometry,
  Camera, ColorRepresentation,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";
import type { RubiksCubeProps, RubiksCubeState } from './RubiksCube';


const stickerSize = 0.90;
const stickerThickness = 0.01;


export function initialize(props: RubiksCubeProps): RubiksCubeState {
  const { stickerColors, cameraAngle } = props;
  const scene = new Scene();

  // Set up camera
  const camera = new OrthographicCamera(...calculateViewingFrustum());
  const y = cameraAngle === 'top' ? 4 : -4;
  camera.position.set(4, y, 4);
  camera.lookAt(0, 0, 0)

  // Set up renderer
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor('magenta', 0)
  renderer.setSize(1000, 1000);

  // Draw cube
  const allCubies: Group[] = [];
  for (let x of [-1, 0, 1]) {
    for (let y of [-1, 0, 1]) {
      for (let z of [-1, 0, 1]) {
        const cubie = createCubie(props, {x, y, z});
        allCubies.push(cubie);
        scene.add(cubie);
      }
    }
  }

  return { scene, camera, renderer, allCubies };
}

function createCubie(props: RubiksCubeProps, position: {x: number, y: number, z: number}): Group {
  const { stickerColors, cameraAngle } = props;
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
      const color = stickerColors[`${dim}=${position[dim]}`] ?? 'gray';
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



export function floatEquals(a: number, b: number, epsilon = 0.00001) {
  return Math.abs(a - b) < epsilon;
}

export function calculateViewingFrustum(): [number, number, number, number, number, number] {
  const aspectRatio = 1;
  const width = 10 * aspectRatio;
  const height = 10;
  return [
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    100,
  ];
}

export function vectorEquals(v: Vector3, w: Vector3, epsilon = 0.00001) {
  return (
    floatEquals(v.x, w.x, epsilon) &&
    floatEquals(v.y, w.y, epsilon) &&
    floatEquals(v.z, w.z, epsilon)
  )
}

