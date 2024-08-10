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
import { Tween, Easing, update as updateAllTweens } from "@tweenjs/tween.js";
import {getMoveDefinition, moveDefinitions} from "./move-definitions";
import type { NumberTween } from "./RubiksCube";

import { MouseEvent, useEffect, useState, useRef } from 'react';

import './App.css';
import { RubiksCubeComponent, RubiksCubeHandle } from './RubiksCube';

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

function App() {
  const cube1Ref = useRef<RubiksCubeHandle>(null);
  const cube2Ref = useRef<RubiksCubeHandle>(null);
  const [activeCube, setActiveCube] = useState<1 | 2>(1);
  const cubeRefs = {
    1: cube1Ref,
    2: cube2Ref,
  } as const;
  const lastTweenRef = useRef<NumberTween | undefined>(undefined);
  useEffect(() => {
    // cubes[1] = new RubiksCube(cube1Colors, 'bottom', 1);
    // cubes[2] = new RubiksCube(cube2Colors, 'top', 2);
    //
    // const cubesContainer = $('#cubes-container')!;
    //
    // cubesContainer.appendChild(cubes[1].getDomElement());
    // cubesContainer.appendChild(cubes[2].getDomElement());
    //
    // // Render first frame
    // cubes[1].render();
    // cubes[2].render();

    // Animation loop
    requestAnimationFrame(function animate(time) {
      requestAnimationFrame(animate);
      updateAllTweens(time);

      // TODO Stop animation loop on unmount
    });

    // document.querySelectorAll('button').forEach(button =>
    //   button.addEventListener('contextmenu', () =>
    //     // eslint-disable-next-line no-restricted-globals
    //     event?.preventDefault()
    //   )
    // );
    //
    // return () => {
    //   cubes[1] = undefined as any;
    //   cubes[2] = undefined as any;
    //   cubesContainer.replaceChildren();
    // };
  }, []);

  function handleClick(cubeId: 1 | 2, moveName: string, e: MouseEvent): void {
    let fullMoveName: string;
    if (e.button === 2) {
      fullMoveName = moveName + 'i';
    } else {
      fullMoveName = moveName;
    }
    if (lastTweenRef.current) {
      lastTweenRef.current.stop();
    }
    const cubeRef = cubeRefs[cubeId];
    const tween = cubeRef.current!.startTurn(fullMoveName);
    setActiveCube(cubeId);
    if (tween) {
      lastTweenRef.current = tween;
    }
  }

  return (
    <>
      <div id="cubes-container">
        <RubiksCubeComponent
          stickerColors={cube1Colors}
          cameraAngle="bottom"
          ref={cube1Ref}
          active={activeCube === 1}
        />
        <RubiksCubeComponent
          stickerColors={cube2Colors}
          cameraAngle="top"
          ref={cube2Ref}
          active={activeCube === 2}
        />
      </div>
      <div id="controls">
        <div>
          <button className="spacer">-</button>
          <button onMouseDown={(event) => handleClick(1, "U", event)}>U</button>
          <button className="spacer">-</button>
          <br />
          <button onMouseDown={(event) => handleClick(1, "L", event)}>L</button>
          <button onMouseDown={(event) => handleClick(1, "F", event)}>F</button>
          <button onMouseDown={(event) => handleClick(1, "R", event)}>R</button>
          <br />
          <button className="spacer">-</button>
          <button onMouseDown={(event) => handleClick(1, "D", event)}>D</button>
          <button onMouseDown={(event) => handleClick(1, "B", event)}>B</button>
          <br />
          <br />
          <br />
          <button onMouseDown={(event) => handleClick(1, "M", event)}>M</button>
          <button onMouseDown={(event) => handleClick(1, "E", event)}>E</button>
          <button onMouseDown={(event) => handleClick(1, "S", event)}>S</button>
          <br />
          <button onMouseDown={(event) => handleClick(1, "x", event)}>x</button>
          <button onMouseDown={(event) => handleClick(1, "y", event)}>y</button>
          <button onMouseDown={(event) => handleClick(1, "z", event)}>z</button>
        </div>
        <div>
          <button className="spacer">-</button>
          <button onMouseDown={(event) => handleClick(2, "U", event)}>U</button>
          <button className="spacer">-</button>
          <br />
          <button onMouseDown={(event) => handleClick(2, "L", event)}>L</button>
          <button onMouseDown={(event) => handleClick(2, "F", event)}>F</button>
          <button onMouseDown={(event) => handleClick(2, "R", event)}>R</button>
          <br />
          <button className="spacer">-</button>
          <button onMouseDown={(event) => handleClick(2, "D", event)}>D</button>
          <button onMouseDown={(event) => handleClick(2, "B", event)}>B</button>
          <br />
          <br />
          <br />
          <button onMouseDown={(event) => handleClick(2, "M", event)}>M</button>
          <button onMouseDown={(event) => handleClick(2, "E", event)}>E</button>
          <button onMouseDown={(event) => handleClick(2, "S", event)}>S</button>
          <br />
          <button onMouseDown={(event) => handleClick(2, "x", event)}>x</button>
          <button onMouseDown={(event) => handleClick(2, "y", event)}>y</button>
          <button onMouseDown={(event) => handleClick(2, "z", event)}>z</button>
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
