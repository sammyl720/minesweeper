import { IGameBoard } from "./interfaces";
import { IPosition } from "./position";
import { CellValue, CellViewState, getCellValue } from "./types";


export interface ICell {
  position: IPosition;
  viewState: CellViewState;
  value: CellValue;
  hasScanned: boolean;
  getSorrundingCells(): ICell[];
  update: (newViewState: CellViewState) => void;
}

export class Cell implements ICell {
  viewState = CellViewState.Hidden;
  private _cellValue = CellValue.Empty;

  hasScanned = false;
  constructor(
    public position: IPosition,
    private gameBoard: IGameBoard,
    isBomb = false
  ) {
    if (isBomb) {
      this._cellValue = CellValue.Bomb;
    }
  }

  get value() {
    if (this._cellValue == CellValue.Bomb || (this.hasScanned && this.gameBoard.isInitialized)) {
      return this._cellValue;
    }

    const sorrundingBombCount = this.getSorrundingCells().filter(cell => this.gameBoard.isCellBomb(cell.position)).length;
    this._cellValue = getCellValue(sorrundingBombCount);

    this.hasScanned = true;
    return this._cellValue;
  }

  getSorrundingCells() {
    return this.gameBoard.getCellNeighbors(this.position);
  }

  update(newViewState: CellViewState) {
    this.viewState = newViewState;
    if (this.viewState == CellViewState.Shown) {
      this.gameBoard.updateBoard(this)
    }
  }
}
