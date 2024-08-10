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
import { useEffect, useRef, useState, MutableRefObject, forwardRef, useImperativeHandle } from 'react';
import { floatEquals, calculateViewingFrustum, initialize } from './RubiksCube.helpers';
import {getMoveDefinition, moveDefinitions} from "./move-definitions";
import { Tween, Easing, update as updateAllTweens } from "@tweenjs/tween.js";

export interface RubiksCubeProps {
  stickerColors: Partial<Record<string, string>>;
  cameraAngle: 'top' | 'bottom';
  active: boolean;
}

// Not React state
export interface RubiksCubeState {
  renderer: WebGLRenderer;
  camera: OrthographicCamera;
  scene: Scene;
  allCubies: Group[];
}

export interface RubiksCubeHandle {
  startTurn: (moveName: string) => NumberTween | undefined;
  turnAndRender: (
    axis: 0 | 1 | 2,
    slice: -1 | 0 | 1,
    angle: number
  ) => void;
}

export type NumberTween = Tween<{ progress: number }>;

export const RubiksCubeComponent = forwardRef(function RubiksCubeComponent(props: RubiksCubeProps, ref) {
  const { stickerColors, cameraAngle, active } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef: MutableRefObject<RubiksCubeState> = useRef(null as any);
  if (stateRef.current === null) {
    stateRef.current = initialize(props);
  }

  useEffect(() => {
    const { renderer, scene, camera } = stateRef.current;

    getContainer().appendChild(renderer.domElement);
    render();

    // setTimeout(() => {
    //   turn(0, -1, Math.PI / 2);
    //   render();
    // }, 1000);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      startTurn(moveName: string) {
        return startTurn(moveName);
      },

      turnAndRender(
        axis: 0 | 1 | 2,
        slice: -1 | 0 | 1,
        angle: number
      ): void {
        turn(axis, slice, angle);
        render();
      },
    } satisfies RubiksCubeHandle;
  }); // TODO Maybe add dependencies

  function getContainer(): HTMLDivElement {
    return containerRef.current!; // !: Because ref={containerRef}, containerRef.current will not be null here
  }

  function render(): void {
    const { renderer, scene, camera } = stateRef.current;
    renderer.render(scene, camera);
  }

  function startTurn(moveName: string): NumberTween | undefined {
    const move = getMoveDefinition(moveName)

    if (!move) {
      console.warn('Move not found: ' + moveName);
      return undefined;
    }

    // if (this.cubeId === 2) {
    //   update1To2.map(([left, _]) => {
    //     cubes[1].setStickerColor(left, 'black')
    //     cubes[1].render()
    //   })
    // } else {
    //   update1To2.map(([_, right]) => {
    //     cubes[2].setStickerColor(right, 'black')
    //     cubes[2].render()
    //   })
    // }

    let lastProgress = 0;

    const onProgress = ({ progress }: { progress: number }) => {
      const { axis, slices, direction } = move;
      const progressDelta = progress - lastProgress;
      lastProgress = progress;
      const angle = direction * progressDelta * Math.PI / 2;
      for (let slice of slices) {
        turn(axis, slice, angle)
      }
      render();
    }

    const tween: NumberTween = new Tween({ progress: 0 })
      .to({ progress: 1 }, 250)
      .easing(Easing.Quadratic.Out)
      .onUpdate(({ progress }) => onProgress({ progress }))
      .onComplete(() => {
        onProgress({ progress: 1 });
        // updateOtherCube(this.cubeId);
      }) // Do I need onComplete? Surely it's covered by onUpdate
      .onStop(() => {
        onProgress({ progress: 1 });
        // updateOtherCube(this.cubeId);
      })
    tween.start();
    return tween;
  }

  function turn(
    axis: 0 | 1 | 2,
    slice: -1 | 0 | 1,
    angle: number
  ) {
    const { allCubies } = stateRef.current;
    const axisVector = new Vector3(0, 0, 0);
    axisVector.setComponent(axis, 1);

    // Find the cubies that should be involved in the turn
    const cubies = allCubies.filter(cubie =>
      floatEquals(slice, cubie.position.getComponent(axis))
    );

    // Turn those cubies
    for (let cubie of cubies) {
      cubie.position.applyAxisAngle(axisVector, angle);
      cubie.rotateOnWorldAxis(axisVector, angle);
    }
  }

  return <>
    <div
      ref={containerRef}
      className={active ? 'active' : ''}
    />
  </>;
});
