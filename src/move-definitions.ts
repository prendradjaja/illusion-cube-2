export interface MoveDefinition {
  axis: 0 | 1 | 2;
  slice: -1 | 0 | 1;
  direction: -1 | 1;
}

// Each entry must be a MoveDefinition
const _moveDefinitions = {
  R: {
    axis: 0,
    slice: 1,
    direction: -1,
  },
  U: {
    axis: 1,
    slice: 1,
    direction: -1,
  },
} as const;

export const moveDefinitions: Record<
  keyof typeof _moveDefinitions,
  MoveDefinition
> = _moveDefinitions;
