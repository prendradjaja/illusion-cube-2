export const update2To1 = [
  ['FUL', 'RUF'],
  ['FU', 'RU'],
  ['FUR', 'RUB'],
  ['FL', 'RF'],
  ['F', 'R'],
  ['FR', 'RB'],
  ['FDL', 'RDF'],
  ['FD', 'RD'],
  ['FDR', 'RDB'],
] as const;

export const update1To2 = update2To1.map(([a, b]) => [b, a]);
