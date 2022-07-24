export interface MoveDefinition {
  axis: 0 | 1 | 2;
  slice: -1 | 0 | 1;
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
    slice: 1,
    direction: -1,
  }),
  U: md({
    axis: 1,
    slice: 1,
    direction: -1,
  }),
};

export const moveDefinitions = {
  ...basicMoveDefinitions,
  Ri: inverse(basicMoveDefinitions.R),
  Ui: inverse(basicMoveDefinitions.U),
}
