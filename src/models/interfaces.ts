import { getPositionToken, getRandomChance } from "src/utils";
import { Cell, ICell } from "./Cell";
import { GameGrid, IGameGrid } from "./game-grid";
import { IObservable, IObserver } from "./observable";
import { Position } from "./position";
import { CellValue, CellViewState, GameStatus, PositionToken, SimplePosition } from "./types";

export interface IGameBoard {
  grid: IGameGrid;
  cells: Map<PositionToken, ICell>;
  status: GameStatus;
  bombsInBoard: number;
  isCellBomb: (position: SimplePosition) => boolean;
  isInitialized: boolean;
  getCellNeighbors: (cell: SimplePosition) => ICell[],
  updateCell: (cell: SimplePosition, newViewState: CellViewState) => void;
  updateBoard: (callingCell: ICell) => void;
}

export class GameBoard implements IGameBoard, IObservable<IGameBoard> {
  cells = new Map<PositionToken, Cell>();
  status = GameStatus.OnGoing;
  bombsInBoard: number;
  isInitialized = false;
  observers: IObserver<IGameBoard>[] = [];

  constructor(
    public grid = new GameGrid()
  ) {
    this.bombsInBoard = Math.round((this.grid.square * 2) / 10);
    this.initBoard();
  }

  initBoard() {
    this.cells.clear();
    this.status = GameStatus.OnGoing;

    let bombsLeft = this.bombsInBoard;

    for (let currentRow = 1; currentRow <= this.grid.rows; currentRow++) {
      for (let currentCol = 1; currentCol <= this.grid.columns; currentCol++) {
        const position = new Position(currentRow, currentCol);

        const isBomb = this.shouldCellBeBomb(currentRow, currentCol, bombsLeft);

        const currentCell = new Cell(
          position,
          this,
          isBomb
        );

        this.cells.set(position.stringify(), currentCell);
        if (isBomb) {
          bombsLeft -= 1;
        }
      }
    }

    this.isInitialized = true;
  }

  private shouldCellBeBomb(currentRow: number, currentCol: number, bombsLeft: number) {
    const totalCells = this.grid.square * 2;
    const cellsFilled = ((currentRow - 1) * this.grid.columns) + (currentCol - 1);
    const cellsLeft = totalCells - cellsFilled;
    const chanceOfBomb = bombsLeft / cellsLeft;
    return getRandomChance(chanceOfBomb);
  }


  isCellBomb(position: SimplePosition) {
    return this.cells.get(getPositionToken(position))?.value == CellValue.Bomb ?? false;
  }

  getCellNeighbors({ row, column }: SimplePosition) {
    const topRow = row - 1;
    const bottomRow = row + 1;
    const leftColumn = column - 1;
    const rightColumn = column + 1;

    const positionTokens: PositionToken[] = [
      getPositionToken({ row: topRow, column: leftColumn }),
      getPositionToken({ row: topRow, column }),
      getPositionToken({ row: topRow, column: rightColumn }),
      getPositionToken({ row, column: rightColumn }),
      getPositionToken({ row: bottomRow, column: rightColumn }),
      getPositionToken({ row: bottomRow, column }),
      getPositionToken({ row: bottomRow, column: leftColumn }),
      getPositionToken({ row, column: leftColumn }),
    ]

    return positionTokens.map(token => this.cells.get(token)).filter((cell: Cell | undefined): cell is Cell => !!cell);
  };

  updateCell(cell: SimplePosition, newViewState: CellViewState) {
    const currentCell = this.cells.get(getPositionToken(cell));
    currentCell?.update(newViewState);
  };

  updateBoard(callingCell: ICell) {
    if (this.isCellBomb(callingCell.position) && callingCell.viewState == CellViewState.Shown) {
      this.gameOver(GameStatus.Lost)
    } else if (callingCell.value == CellValue.Empty) {
      this.getCellNeighbors(callingCell.position)
        .filter(cell => !this.isCellBomb(cell.position) && cell.viewState == CellViewState.Hidden)
        .forEach(cell => this.updateCell(cell.position, CellViewState.Shown))
    }
  }

  subscribe(observer: IObserver<IGameBoard>) {
    if (!this.observers.find(obs => obs === observer)) {
      this.observers.push(observer);
    }
  }

  unsubscribe(observer: IObserver<IGameBoard>) {
    this.observers = this.observers.filter(obs => obs === observer);
  }

  private gameOver(status: Exclude<GameStatus, 0>) {
    this.status = status;
    switch (status) {
      default:
        break;
    }

    this.emit();
  }

  emit() {
    this.observers.forEach(obs => obs.update(this));
  }
}
