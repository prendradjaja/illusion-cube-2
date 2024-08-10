import { update as updateAllTweens } from "@tweenjs/tween.js";
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
export default App;
