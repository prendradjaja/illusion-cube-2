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

export interface RubiksCubeProps {
  stickerColors: Partial<Record<string, string>>;
  cameraAngle: 'top' | 'bottom';
}

// Not React state
export interface RubiksCubeState {
  renderer: WebGLRenderer;
  camera: OrthographicCamera;
  scene: Scene;
  allCubies: Group[];
}

export interface RubiksCubeHandle {
  turnAndRender: (
    axis: 0 | 1 | 2,
    slice: -1 | 0 | 1,
    angle: number
  ) => void;
}

export const RubiksCubeComponent = forwardRef(function RubiksCubeComponent(props: RubiksCubeProps, ref) {
  const { stickerColors, cameraAngle } = props;
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
      turnAndRender(
        axis: 0 | 1 | 2,
        slice: -1 | 0 | 1,
        angle: number
      ): void {
        turn(axis, slice, angle);
        render();
      },
    } satisfies RubiksCubeHandle;
  });

  function getContainer(): HTMLDivElement {
    return containerRef.current!; // !: Because ref={containerRef}, containerRef.current will not be null here
  }

  function render(): void {
    const { renderer, scene, camera } = stateRef.current;
    renderer.render(scene, camera);
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
    <div ref={containerRef} />
  </>;
});
