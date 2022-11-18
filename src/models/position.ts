import { ColumnToken, PositionToken, RowToken } from "./types";

export interface IPosition {
  row: number;
  column: number;

  stringify: () => PositionToken;
  matchesString: (str: PositionToken) => boolean;
}

export class Position implements IPosition {
  constructor(
    public row: number,
    public column: number,
  ) {

  }

  stringify() {
    return `row=${this.row};column=${this.column}` as const;
  }

  matchesString(str: PositionToken) {
    const [rowToken, colToken] = str.split(";") as [RowToken, ColumnToken];
    const row = +rowToken.split("=")[1];
    const column = +colToken.split("=")[1];

    const isThisRow = row == this.row;
    const isThisColumn = column == this.column;
    return isThisRow && isThisColumn;
  }
}
