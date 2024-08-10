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
import { floatEquals, calculateViewingFrustum, initialize, locationNameToCubiePosition, locationNameToStickerPosition, vectorEquals } from './RubiksCube.helpers';
import {getMoveDefinition, moveDefinitions} from "./move-definitions";
import { Tween, Easing, update as updateAllTweens } from "@tweenjs/tween.js";

export interface RubiksCubeProps {
  stickerColors: Partial<Record<string, string>>;
  cameraAngle: 'top' | 'bottom';
  active: boolean;
  onCompleteOrStop: () => void;
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
  getStickerColor: (stickerName: LocationName) => string;
  setStickerColor: (stickerName: LocationName, color: ColorRepresentation) => void;
  render: () => void;
}

export type NumberTween = Tween<{ progress: number }>;

type FaceName = 'U' | 'F' | 'R' | 'D' | 'B' | 'L';
type LocationName =
  | `${FaceName}${FaceName}${FaceName}` // e.g. "RUF" (a sticker on a corner piece)
  | `${FaceName}${FaceName}` // e.g. "RU" (a sticker on an edge piece)
  | `${FaceName}`; // e.g. "R" (a sticker on a center piece)

export const RubiksCubeComponent = forwardRef(function RubiksCubeComponent(props: RubiksCubeProps, ref) {
  const { stickerColors, cameraAngle, active, onCompleteOrStop } = props;
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
      startTurn,
      getStickerColor,
      setStickerColor,
      render,
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

    console.log(getStickerColor('UFR'));

    if (!move) {
      console.warn('Move not found: ' + moveName);
      return undefined;
    }

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
        onCompleteOrStop();
      })
      .onStop(() => {
        onProgress({ progress: 1 });
        onCompleteOrStop();
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

  function getStickerColor(stickerName: LocationName): string {
    return '#' + getStickerMaterial(stickerName).color.getHexString();
  }

  function setStickerColor(stickerName: LocationName, color: ColorRepresentation): void {
    getStickerMaterial(stickerName).color.set(color);
  }

  function getStickerMaterial(stickerName: LocationName): MeshBasicMaterial {
    const { allCubies } = stateRef.current;
    const cubiePosition = locationNameToCubiePosition(stickerName);
    const stickerPosition = locationNameToStickerPosition(stickerName);
    const cubie = allCubies.find(
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

  return <>
    <div
      ref={containerRef}
      className={active ? 'active' : ''}
    />
  </>;
});
