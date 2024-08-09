import {
  BoxGeometry,
  Camera, Color, ColorRepresentation,
  Group, Material,
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

import './App.css';
import { MouseEvent, useEffect, useState, useRef } from 'react';

const $ = (s: string) => document.querySelector(s);

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

const stickerSize = 0.90;
const stickerThickness = 0.01;

const cubes = {
  1: undefined as unknown as RubiksCube, // To be initialized on <App> mount
  2: undefined as unknown as RubiksCube,
}

function App() {
  useEffect(() => {
    cubes[1] = new RubiksCube(cube1Colors, 'bottom', 1);
    cubes[2] = new RubiksCube(cube2Colors, 'top', 2);

    const cubesContainer = $('#cubes-container')!;

    cubesContainer.appendChild(cubes[1].getDomElement());
    cubesContainer.appendChild(cubes[2].getDomElement());

    // Render first frame
    cubes[1].render();
    cubes[2].render();

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

    document.querySelectorAll('button').forEach(button =>
      button.addEventListener('contextmenu', () =>
        // eslint-disable-next-line no-restricted-globals
        event?.preventDefault()
      )
    );

    return () => {
      cubes[1] = undefined as any;
      cubes[2] = undefined as any;
      cubesContainer.replaceChildren();
    };
  }, []);

  function handleClick(cubeId: 1 | 2, moveName: string, e: MouseEvent): void {
    if (e.button === 0) {
      cubes[cubeId].startTurn(moveName)
    } else if (e.button === 2) {
      cubes[cubeId].startTurn(moveName + 'i')
    }
  }

  return (
    <>
      <div id="cubes-container"></div>
      <div id="controls">
        <div>
          <button className="spacer">-</button
          ><button onMouseDown={(event) => handleClick(1, 'U', event)}>U</button
          ><button className="spacer">-</button>
          <br />
          <button  onMouseDown={(event) => handleClick(1, 'L', event)}>L</button
          ><button onMouseDown={(event) => handleClick(1, 'F', event)}>F</button
          ><button onMouseDown={(event) => handleClick(1, 'R', event)}>R</button>
          <br />
          <button className="spacer">-</button
          ><button onMouseDown={(event) => handleClick(1, 'D', event)}>D</button
          ><button onMouseDown={(event) => handleClick(1, 'B', event)}>B</button>
          <br />
          <br />
          <br />
          <button  onMouseDown={(event) => handleClick(1, 'M', event)}>M</button
          ><button onMouseDown={(event) => handleClick(1, 'E', event)}>E</button
          ><button onMouseDown={(event) => handleClick(1, 'S', event)}>S</button>
          <br />
          <button  onMouseDown={(event) => handleClick(1, 'x', event)}>x</button
          ><button onMouseDown={(event) => handleClick(1, 'y', event)}>y</button
          ><button onMouseDown={(event) => handleClick(1, 'z', event)}>z</button>
        </div>
        <div>
          <button className="spacer">-</button
          ><button onMouseDown={(event) => handleClick(2, 'U', event)}>U</button
          ><button className="spacer">-</button>
          <br />
          <button  onMouseDown={(event) => handleClick(2, 'L', event)}>L</button
          ><button onMouseDown={(event) => handleClick(2, 'F', event)}>F</button
          ><button onMouseDown={(event) => handleClick(2, 'R', event)}>R</button>
          <br />
          <button className="spacer">-</button
          ><button onMouseDown={(event) => handleClick(2, 'D', event)}>D</button
          ><button onMouseDown={(event) => handleClick(2, 'B', event)}>B</button>
          <br />
          <br />
          <br />
          <button  onMouseDown={(event) => handleClick(2, 'M', event)}>M</button
          ><button onMouseDown={(event) => handleClick(2, 'E', event)}>E</button
          ><button onMouseDown={(event) => handleClick(2, 'S', event)}>S</button>
          <br />
          <button  onMouseDown={(event) => handleClick(2, 'x', event)}>x</button
          ><button onMouseDown={(event) => handleClick(2, 'y', event)}>y</button
          ><button onMouseDown={(event) => handleClick(2, 'z', event)}>z</button>
        </div>
      </div>
    </>
  );
}

const update2To1 = [
  ['FUL', 'RUF'],
  ['FU', 'RU'],
  ['FUR', 'RUB'],
  ['FL', 'RF'],
  ['F', 'R'],
  ['FR', 'RB'],
  ['FDL', 'RDF'],
  ['FD', 'RD'],
  ['FDR', 'RDB'],
] as const;

const update1To2 = update2To1.map(([a, b]) => [b, a]);

function updateOtherCube(sourceCubeId: 1 | 2): void {
  if (sourceCubeId === 2) {
    const destCubeId = 1;
    const sourceCube = cubes[sourceCubeId];
    const destCube = cubes[destCubeId];
    for (let [sourceSticker, destSticker] of update2To1) {
      destCube.setStickerColor(destSticker, sourceCube.getStickerColor(sourceSticker));
    }
    destCube.render();
  } else {
    const destCubeId = 2;
    const sourceCube = cubes[sourceCubeId];
    const destCube = cubes[destCubeId];
    for (let [sourceSticker, destSticker] of update1To2) {
      destCube.setStickerColor(destSticker, sourceCube.getStickerColor(sourceSticker));
    }
    destCube.render();
  }
}

function getOtherCube(cubeId: 1 | 2): RubiksCube {
  if (cubeId === 1) {
    return cubes[2]
  } else {
    return cubes[1];
  }
}

class RubiksCube {
  private allCubies: Group[] = []; // TODO Rename to just cubies?

  private camera: Camera;
  private scene: Scene;
  private renderer: WebGLRenderer;

  private lastTween: Tween<{ progress: number }> | undefined;

  constructor(
    private stickerColors: Partial<Record<string, string>>,
    cameraAngle: 'top' | 'bottom',
    private cubeId: 1 | 2
  ) {
    this.scene = new Scene();

    // Set up camera
    this.camera = new OrthographicCamera(...calculateViewingFrustum());
    const y = cameraAngle === 'top' ? 4 : -4;
    this.camera.position.set(4, y, 4);
    this.camera.lookAt(0, 0, 0)

    // Set up renderer
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor('magenta', 0)
    this.renderer.setSize(1000, 1000);

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

  public setActive(active: boolean): void {
    this.renderer.domElement.classList.toggle('active', active);
  }

  public startTurn(moveName: string): void {
    const move = getMoveDefinition(moveName)

    if (!move) {
      console.warn('Move not found: ' + moveName);
      return
    }

    this.setActive(true);
    getOtherCube(this.cubeId).setActive(false);


    if (this.lastTween) {
      // If the most recent tween is still in progress, we want to skip to the
      // end.
      this.lastTween.stop();
    }

    if (this.cubeId === 2) {
      update1To2.map(([left, _]) => {
        cubes[1].setStickerColor(left, 'black')
        cubes[1].render()
      })
    } else {
      update1To2.map(([_, right]) => {
        cubes[2].setStickerColor(right, 'black')
        cubes[2].render()
      })
    }

    let lastProgress = 0;

    const onProgress = ({ progress }: { progress: number }) => {
      const { axis, slices, direction } = move;
      const progressDelta = progress - lastProgress;
      lastProgress = progress;
      const angle = direction * progressDelta * Math.PI / 2;
      for (let slice of slices) {
        this.turn(axis, slice, angle)
      }
      this.render();
    }

    const tween = new Tween({ progress: 0 })
      .to({ progress: 1 }, 250)
      .easing(Easing.Quadratic.Out)
      .onUpdate(({ progress }) => onProgress({ progress }))
      .onComplete(() => {
        onProgress({ progress: 1 });
        updateOtherCube(this.cubeId);
      })
      .onStop(() => {
        onProgress({ progress: 1 });
        updateOtherCube(this.cubeId);
      })
    tween.start();
    this.lastTween = tween;
  };

  public getStickerColor(stickerName: LocationName): string {
    return '#' + this.getStickerMaterial(stickerName).color.getHexString();
  }

  public setStickerColor(stickerName: LocationName, color: ColorRepresentation): void {
    this.getStickerMaterial(stickerName).color.set(color);
  }

  private getStickerMaterial(stickerName: LocationName): MeshBasicMaterial {
    const cubiePosition = locationNameToCubiePosition(stickerName);
    const stickerPosition = locationNameToStickerPosition(stickerName);
    const cubie = this.allCubies.find(
      each => {
        const position = new Vector3();
        each.getWorldPosition(position);
        return vectorEquals(position, cubiePosition)
      }
    );
    if (!cubie) {
      throw new Error("Cubie not found");
    }
    const sticker = cubie.children.find(
      each => {
        const position = new Vector3();
        each.getWorldPosition(position);
        return vectorEquals(position, stickerPosition);
      }
    )
    if (!sticker) {
      throw new Error("Sticker not found");
    }
    if (!(sticker instanceof Mesh)) {
      throw new Error("Sticker is not a Mesh")
    }
    const material = sticker.material
    if (!(material instanceof MeshBasicMaterial)) {
      throw new Error("Sticker is not a MeshBasicMaterial")
    }
    return material;
  }
}

type FaceName = 'U' | 'F' | 'R' | 'D' | 'B' | 'L';
type LocationName =
  | `${FaceName}${FaceName}${FaceName}` // e.g. "RUF" (a sticker on a corner piece)
  | `${FaceName}${FaceName}` // e.g. "RU" (a sticker on an edge piece)
  | `${FaceName}`; // e.g. "R" (a sticker on a center piece)

function faceNameToAxis(face: FaceName): 0 | 1 | 2 {
  if (face === 'R' || face === 'L') {
    return 0;
  } else if (face === 'U' || face === 'D') {
    return 1
  } else if (face === 'F' || face === 'B') {
    return 2
  }
  throw new Error("Unreachable case");
}

const faceNameToVector = {
  R: new Vector3(1, 0, 0),
  L: new Vector3(-1, 0, 0),
  U: new Vector3(0, 1, 0),
  D: new Vector3(0, -1, 0),
  F: new Vector3(0, 0, 1),
  B: new Vector3(0, 0, -1),
} as const;

function locationNameToCubiePosition(location: LocationName): Vector3 {
  const faces = Array.from(location) as FaceName[];

  if (
    !isAllUnique(
      faces.map(face => faceNameToAxis(face))
    )
  ) {
    // Could define StickerName as `type StickerName = 'RUF' | 'RFU' | 'LUF' | ...` and prevent this case at compile time
    throw new Error('An axis was specified twice: ' + location)
  }

  const result = new Vector3();
  for (let face of faces) {
    result.add(faceNameToVector[face])
  }
  return result;
}

function locationNameToStickerPosition(location: LocationName): Vector3 {
  const primaryFace = location[0] as FaceName;
  const result = locationNameToCubiePosition(location);
  result.addScaledVector(
    faceNameToVector[primaryFace],
    0.5
  )
  return result;
}

function isAllUnique(arr: number[]): boolean {
  return arr.length === new Set(arr).size;
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

function vectorEquals(v: Vector3, w: Vector3, epsilon = 0.00001) {
  return (
    floatEquals(v.x, w.x, epsilon) &&
    floatEquals(v.y, w.y, epsilon) &&
    floatEquals(v.z, w.z, epsilon)
  )
}

function calculateViewingFrustum(): [number, number, number, number, number, number] {
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

export default App;
