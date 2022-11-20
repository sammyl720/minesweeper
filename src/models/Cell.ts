import { IGameBoard } from "./game-board";
import { IPosition } from "./position";
import { CellValue, CellViewState, getCellValue } from "./types";


export interface ICell {
  position: IPosition;
  viewState: CellViewState;
  value: CellValue;
  hasScanned: boolean;
  getSorrundingCells(): ICell[];
  update: (newViewState: CellViewState) => void;
  /**
   * Cell is hidden and has numeric value
   */
  isHiddenValue: () => boolean;
  /**
   * Cell has a numeric value
   */
  hasValue: () => boolean;
  canActivateNeighbors: () => boolean;
  hasFlag: () => boolean;
  hasBomb: () => boolean;
  isHidden: () => boolean;
  /**
   * Cell is hidden and doesn't have a bomb
   */
  isSafeHidden: () => boolean;
  isSafeShown: () => boolean;
  isShown: () => boolean;
  isShownValue: () => boolean;
  isShownBomb: () => boolean;
  isEmpty: () => boolean;
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
    if (!this.gameBoard.isInProgress()) {
      return;
    }

    const previousViewState = this.viewState;
    this.viewState = newViewState;

    if (
      this.isShown() &&
      previousViewState != CellViewState.Flagged
    ) {
      this.gameBoard.updateBoard(this)
    }
  }

  hasValue() {
    return this._cellValue != CellValue.Bomb && this._cellValue != CellValue.Empty;
  }

  isShownValue() {
    return this.hasValue() && this.isShown();
  }

  isHiddenValue() {
    return this.hasValue() && this.isHidden();
  }

  canActivateNeighbors() {
    return this.isEmpty() && !this.hasFlag();
  }

  hasFlag() {
    return this.viewState == CellViewState.Flagged
  }

  isHidden() {
    return this.viewState == CellViewState.Hidden;
  }

  isShown() {
    return this.viewState == CellViewState.Shown;
  }

  isEmpty() {
    return this.value == CellValue.Empty;
  }

  hasBomb() {
    return this._cellValue === CellValue.Bomb;
  }

  isShownBomb() {
    return this.hasBomb() && this.isShown();
  }

  isSafeHidden() {
    return this.isHidden() && !this.hasBomb();
  }

  isSafeShown() {
    return this.isShown() && !this.hasBomb();
  }

  toString() {
    const { position: { row, column }, value } = this;
    const s = `row: ${row}, column: ${column}, value: ${value.toString()}\n`;
    return s;
  }
}
