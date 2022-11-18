
export interface IGameGrid {
  rows: number;
  columns: number;
  square: number;
}

export class GameGrid implements IGameGrid {
  rows: number;
  columns: number;
  constructor(
    public square = 10
  ) {
    this.rows = square;
    this.columns = square;
  }
}
