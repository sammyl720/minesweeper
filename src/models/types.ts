export enum GameStatus {
  None,
  OnGoing,
  Won,
  Lost,
  TimeOut
}

export enum CellViewState {
  Hidden,
  Shown,
  Flagged
}

export enum CellValue {
  Empty,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Bomb = "Bomb"
}

export function getCellValue(surroundingBombs: number): CellValue {
  const cellValues = CellValue;
  if (typeof cellValues[surroundingBombs] != undefined) {
    const index = (cellValues[surroundingBombs] as unknown) as string;
    return +CellValue[index as any]
  }
  return CellValue.Empty;
}
export type RowToken = `row=${number}`;
export type ColumnToken = `column=${number}`;
export type PositionToken = `${RowToken};${ColumnToken}`;

export interface SimplePosition { row: number; column: number }
