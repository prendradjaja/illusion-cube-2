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
  x: md({
    axis: 0,
    slices: [-1, 0, 1],
    direction: -1,
  }),
};

export const moveDefinitions = {
  ...basicMoveDefinitions,
  Ri: inverse(basicMoveDefinitions.R),
  Ui: inverse(basicMoveDefinitions.U),
  xi: inverse(basicMoveDefinitions.x),
}

export function getMoveDefinition(moveName: string): MoveDefinition | undefined {
  return (moveDefinitions as Partial<Record<string, MoveDefinition>>)[moveName];
}
