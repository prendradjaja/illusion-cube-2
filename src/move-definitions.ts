export interface MoveDefinition {
  axis: 0 | 1 | 2;
  slices: (-1 | 0 | 1)[];
  direction: -1 | 1;
}

function md(movedef: MoveDefinition): MoveDefinition {
  return movedef;
}

function inverse(move: MoveDefinition): MoveDefinition {
  return {
    ...move,
    direction: -move.direction as -1 | 1
  }
}

const basicMoveDefinitions = {
  R: md({
    axis: 0,
    slices: [1],
    direction: -1,
  }),
  U: md({
    axis: 1,
    slices: [1],
    direction: -1,
  }),
  F: md({
    axis: 2,
    slices: [1],
    direction: -1,
  }),
  L: md({
    axis: 0,
    slices: [-1],
    direction: 1,
  }),
  D: md({
    axis: 1,
    slices: [-1],
    direction: 1,
  }),
  B: md({
    axis: 2,
    slices: [-1],
    direction: 1,
  }),
  M: md({
    axis: 0,
    slices: [0],
    direction: 1,
  }),
  E: md({
    axis: 1,
    slices: [0],
    direction: 1,
  }),
  S: md({
    axis: 2,
    slices: [0],
    direction: -1,
  }),
  x: md({
    axis: 0,
    slices: [-1, 0, 1],
    direction: -1,
  }),
  y: md({
    axis: 1,
    slices: [-1, 0, 1],
    direction: -1,
  }),
  z: md({
    axis: 2,
    slices: [-1, 0, 1],
    direction: -1,
  }),
};

export const moveDefinitions = {
  ...basicMoveDefinitions,
  Ri: inverse(basicMoveDefinitions.R),
  Ui: inverse(basicMoveDefinitions.U),
  Fi: inverse(basicMoveDefinitions.F),
  Li: inverse(basicMoveDefinitions.L),
  Di: inverse(basicMoveDefinitions.D),
  Bi: inverse(basicMoveDefinitions.B),
  Mi: inverse(basicMoveDefinitions.M),
  Ei: inverse(basicMoveDefinitions.E),
  Si: inverse(basicMoveDefinitions.S),
  xi: inverse(basicMoveDefinitions.x),
  yi: inverse(basicMoveDefinitions.y),
  zi: inverse(basicMoveDefinitions.z),

  // TODO try this (it works, but will take some effort to make the types work, and I'm not sure if it's an improvement)
  // ...Object.fromEntries(Object.entries(basicMoveDefinitions).map((([name, movedef]) => [name + 'i', inverse(movedef)]))),
};

export function getMoveDefinition(moveName: string): MoveDefinition | undefined {
  return (moveDefinitions as Partial<Record<string, MoveDefinition>>)[moveName];
}
