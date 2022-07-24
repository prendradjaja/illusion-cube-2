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
import {getMoveDefinition, MoveDefinition, moveDefinitions} from "./move-definitions";

const cube1Colors = {
  'x=1': 'green',
  'x=-1': 'blue',
  'y=1': 'white',
  'y=-1': 'yellow',
  'z=1': 'orange',
  'z=-1': 'red',
} as Partial<Record<string, string>>;

const cube2Colors = {
  'x=1': 'red',
  'x=-1': 'orange',
  'y=1': 'white',
  'y=-1': 'yellow',
  'z=1': 'green',
  'z=-1': 'blue',
} as Partial<Record<string, string>>;

const stickerSize = 0.85;
const stickerThickness = 0.01;

function main() {
  const cube1 = new RubiksCube(cube1Colors, 'bottom');
  const cube2 = new RubiksCube(cube2Colors, 'top');

  document.getElementById('cube1-container')!.appendChild(cube1.getDomElement());
  document.getElementById('cube2-container')!.appendChild(cube2.getDomElement());

  // Render first frame
  cube1.render();
  cube2.render();

  // Animation loop
  requestAnimationFrame(function animate(time) {
    requestAnimationFrame(animate);
    updateAllTweens(time);

    // In principle, we could render on every frame like this. But that seems
    // wasteful, so I'm avoiding that! Instead, by calling render() inside
    // onProgress(), I only render while tweening (i.e. while making a turn).
    // Probably not a big deal though -- normal fully-animated scenes need to
    // render on every frame anyway.

    // cube1.render();
    // cube2.render();
  });

  // Button handler
  (window as any).startTurn = (cubeId: 1 | 2, moveName: string) =>
    (cubeId === 1 ? cube1 : cube2).startTurn(moveName);
}

class RubiksCube {
  private allCubies: Group[] = []; // TODO Rename to just cubies?

  private camera: Camera;
  private scene: Scene;
  private renderer: WebGLRenderer;

  private lastTween: Tween<{ progress: number }> | undefined;

  constructor(
    private stickerColors: Partial<Record<string, string>>,
    cameraAngle: 'top' | 'bottom'
  ) {
    this.scene = new Scene();

    // Set up camera
    this.camera = new OrthographicCamera(...calculateViewingFrustum());
    /* this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10); */
    const y = cameraAngle === 'top' ? 4 : -4;
    this.camera.position.set(4, y, 4);
    this.camera.lookAt(0, 0, 0)

    // Set up renderer
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('gray')
    this.renderer.setSize(800, 800);

    // Draw cube
    for (let x of [-1, 0, 1]) {
      for (let y of [-1, 0, 1]) {
        for (let z of [-1, 0, 1]) {
          const cubie = this.createCubie({x, y, z});
          this.allCubies.push(cubie);
          this.scene.add(cubie);
        }
      }
    }
  }

  public getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private createCubie(position: {x: number, y: number, z: number}): Group {
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
        const color = this.stickerColors[`${dim}=${position[dim]}`] ?? 'gray';
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

  private turn(
    axis: 0 | 1 | 2,
    slice: -1 | 0 | 1,
    angle: number
  ) {
    const axisVector = new Vector3(0, 0, 0);
    axisVector.setComponent(axis, 1);

    // Find the cubies that should be involved in the turn
    const cubies = this.allCubies.filter(
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

  public startTurn(moveName: string): void {
    const move = getMoveDefinition(moveName)

    if (!move) {
      return
    }

    if (this.lastTween) {
      // If the most recent tween is still in progress, we want to skip to the
      // end.
      this.lastTween.stop();
    }

    let lastProgress = 0;

    const onProgress = ({ progress }: { progress: number }) => {
      const { axis, slice, direction } = move;
      const progressDelta = progress - lastProgress;
      lastProgress = progress;
      const angle = direction * progressDelta * Math.PI / 2;
      this.turn(axis, slice, angle)
      this.render();
    }

    const tween = new Tween({ progress: 0 })
      .to({ progress: 1 }, 250)
      .easing(Easing.Quadratic.Out)
      .onUpdate(({ progress }) => onProgress({ progress }))
      .onComplete(() => onProgress({ progress: 1 })) // Do I need onComplete? Surely it's covered by onUpdate
      .onStop(() => onProgress({ progress: 1 }))
    tween.start();
    this.lastTween = tween;
  };
}

function onKeyDown(evt: KeyboardEvent, cube: RubiksCube): void {
  let moveName: keyof typeof moveDefinitions;

  if (evt.key === 'j' || evt.key === 'ArrowDown') {
    moveName = 'Ri';
  } else if (evt.key === 'k' || evt.key === 'ArrowUp') {
    moveName = 'R';
  } else if (evt.key === 'h' || evt.key === 'ArrowLeft') {
    moveName = 'Ui';
  } else if (evt.key === 'l' || evt.key === 'ArrowRight') {
    moveName = 'U';
  } else {
    return;
  }

  cube.startTurn(moveName);
}

function floatEquals(a: number, b: number, epsilon = 0.00001) {
  return Math.abs(a - b) < epsilon;
}

function calculateViewingFrustum(): [number, number, number, number, number, number] {
  const aspectRatio = 1;
  const width = 7 * aspectRatio;
  const height = 7;
  return [
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    100,
  ];
}

main();
