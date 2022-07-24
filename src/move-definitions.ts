export interface MoveDefinition {
  axis: 0 | 1 | 2;
  slice: -1 | 0 | 1;
  direction: -1 | 1;
}

function md(movedef: MoveDefinition): MoveDefinition {
  return movedef;
}

export const moveDefinitions = {
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
} as const;
