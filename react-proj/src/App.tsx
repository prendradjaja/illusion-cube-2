import { update as updateAllTweens } from "@tweenjs/tween.js";
import type { NumberTween } from "./RubiksCube";

import { MouseEvent, useEffect, useState, useRef } from 'react';

import './App.css';
import { RubiksCube, RubiksCubeHandle } from './RubiksCube';
import { update1To2, update2To1 } from './update-maps';

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
    const tween = getCube(cubeRef).startTurn(fullMoveName);
    setActiveCube(cubeId);

    // setActiveCube doesn't (necessarily?) happen synchronously.
    // Is it possible for the following render to happen ahead of setActiveCube's render? That would be bad! (a flash of black)
    if (cubeId === 2) {
      update1To2.forEach(([left, _]) => {
        getCube(cubeRefs[1]).setStickerColor(left, 'black')
        getCube(cubeRefs[1]).render()
      })
    } else {
      update1To2.forEach(([_, right]) => {
        getCube(cubeRefs[2]).setStickerColor(right, 'black')
        getCube(cubeRefs[2]).render()
      })
    }

    if (tween) {
      lastTweenRef.current = tween;
    }
  }

  function updateOtherCube(sourceCubeId: 1 | 2): void {
    if (sourceCubeId === 2) {
      const destCubeId = 1;
      const sourceCube = getCube(cubeRefs[sourceCubeId]);
      const destCube = getCube(cubeRefs[destCubeId]);
      for (let [sourceSticker, destSticker] of update2To1) {
        destCube.setStickerColor(destSticker, sourceCube.getStickerColor(sourceSticker));
      }
      destCube.render();
    } else {
      const destCubeId = 2;
      const sourceCube = getCube(cubeRefs[sourceCubeId]);
      const destCube = getCube(cubeRefs[destCubeId]);
      for (let [sourceSticker, destSticker] of update1To2) {
        destCube.setStickerColor(destSticker, sourceCube.getStickerColor(sourceSticker));
      }
      destCube.render();
    }
  }

  function getCube(cubeRef: typeof cube1Ref): RubiksCubeHandle {
    // !: Because ref={cube1Ref} and ref={cube2Ref}, cubeRef.current will not be null here
    return cubeRef.current!;
  }

  return (
    <>
      <div id="cubes-container">
        <RubiksCube
          stickerColors={cube1Colors}
          cameraAngle="bottom"
          ref={cube1Ref}
          active={activeCube === 1}
          onCompleteOrStop={() => updateOtherCube(1)}
        />
        <RubiksCube
          stickerColors={cube2Colors}
          cameraAngle="top"
          ref={cube2Ref}
          active={activeCube === 2}
          onCompleteOrStop={() => updateOtherCube(2)}
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
