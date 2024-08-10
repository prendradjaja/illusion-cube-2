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
  const [activeCube, setActiveCube] = useState<1 | 2>(1);

  const cube1Ref = useRef<RubiksCubeHandle>(null);
  const cube2Ref = useRef<RubiksCubeHandle>(null);
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
          <MoveButton cubeId={1} moveName="U" onClick={handleClick} />
          <button className="spacer">-</button>
          <br />
          <MoveButton cubeId={1} moveName="L" onClick={handleClick} />
          <MoveButton cubeId={1} moveName="F" onClick={handleClick} />
          <MoveButton cubeId={1} moveName="R" onClick={handleClick} />
          <br />
          <button className="spacer">-</button>
          <MoveButton cubeId={1} moveName="D" onClick={handleClick} />
          <MoveButton cubeId={1} moveName="B" onClick={handleClick} />
          <br />
          <br />
          <br />
          <MoveButton cubeId={1} moveName="M" onClick={handleClick} />
          <MoveButton cubeId={1} moveName="E" onClick={handleClick} />
          <MoveButton cubeId={1} moveName="S" onClick={handleClick} />
          <br />
          <MoveButton cubeId={1} moveName="x" onClick={handleClick} />
          <MoveButton cubeId={1} moveName="y" onClick={handleClick} />
          <MoveButton cubeId={1} moveName="z" onClick={handleClick} />
        </div>
        <div>
          <button className="spacer">-</button>
          <MoveButton cubeId={2} moveName="U" onClick={handleClick} />
          <button className="spacer">-</button>
          <br />
          <MoveButton cubeId={2} moveName="L" onClick={handleClick} />
          <MoveButton cubeId={2} moveName="F" onClick={handleClick} />
          <MoveButton cubeId={2} moveName="R" onClick={handleClick} />
          <br />
          <button className="spacer">-</button>
          <MoveButton cubeId={2} moveName="D" onClick={handleClick} />
          <MoveButton cubeId={2} moveName="B" onClick={handleClick} />
          <br />
          <br />
          <br />
          <MoveButton cubeId={2} moveName="M" onClick={handleClick} />
          <MoveButton cubeId={2} moveName="E" onClick={handleClick} />
          <MoveButton cubeId={2} moveName="S" onClick={handleClick} />
          <br />
          <MoveButton cubeId={2} moveName="x" onClick={handleClick} />
          <MoveButton cubeId={2} moveName="y" onClick={handleClick} />
          <MoveButton cubeId={2} moveName="z" onClick={handleClick} />
        </div>
      </div>
    </>
  );
}

function MoveButton(props: {
  cubeId: 1 | 2,
  moveName: string,
  onClick: (
    cubeId: 1 | 2,
    moveName: string,
    event: MouseEvent
  ) => void,
}) {
  const { cubeId, moveName, onClick } = props;
  return (
    <button
      onMouseDown={(event) => onClick(cubeId, moveName, event)}
      onContextMenu={(event) => event.preventDefault()}
    >
      { moveName }
    </button>
  );
}

export default App;
