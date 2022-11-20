import { interval, map, Observable, ReplaySubject, startWith, switchMap, tap } from "rxjs";
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
  gameOver: (status: Exclude<GameStatus, 0 | 1>) => void;
  isGameOver: boolean;
  isInProgress: () => boolean;
  timeRemaining$: Observable<number>;
  showBoard: () => void;
}

export class GameBoard implements IGameBoard, IObservable<IGameBoard> {
  cells = new Map<PositionToken, Cell>();
  bombCells: PositionToken[] = [];
  status = GameStatus.None;
  bombsInBoard: number;
  isInitialized = false;
  observers: IObserver<IGameBoard>[] = [];
  private gameStarted = new ReplaySubject<boolean>(1);
  timeRemaining$: Observable<number>;

  constructor(
    public grid = new GameGrid(),
    bombsInBoard?: number,
    time = 1000
  ) {
    this.bombsInBoard = !!bombsInBoard ? bombsInBoard : Math.round((this.grid.square ** 2) / 10);
    this.initBoard();

    this.timeRemaining$ = this.gameStarted.pipe(
      tap(() => {
        this.status = GameStatus.OnGoing;
      }),
      switchMap(() => {
        return interval(1000).pipe(
          map(i => time - i),
          tap(timeLeft => {
            if (timeLeft <= 0) {
              this.gameOver(GameStatus.TimeOut)
            }
          })
        )
      }),
      startWith(time)
    )
  }

  initBoard() {
    this.cells.clear();

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
          this.bombCells.push(position.stringify());
        }
      }
    }

    this.isInitialized = true;
    this.emit();
  }

  private shouldCellBeBomb(currentRow: number, currentCol: number, bombsLeft: number) {
    const totalCells = this.grid.square ** 2;
    const cellsFilled = ((currentRow - 1) * this.grid.columns) + (currentCol - 1);
    const cellsLeft = totalCells - cellsFilled;
    const chanceOfBomb = bombsLeft / cellsLeft;
    return getRandomChance(chanceOfBomb);
  }


  isCellBomb(position: SimplePosition) {
    return this.bombCells.includes(getPositionToken(position));
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
    if (this.status === GameStatus.None) {
      this.gameStarted.next(true);
      this.status = GameStatus.OnGoing;
      this.emit();
    }

    const currentCell = this.cells.get(getPositionToken(cell));
    currentCell?.update(newViewState);
  };

  updateBoard(callingCell: ICell) {
    if (this.status != GameStatus.OnGoing) {
      throw new Error("Game is not ongoing");
    }
    if (callingCell.hasBomb() && !callingCell.hasFlag()) {
      this.gameOver(GameStatus.Lost);
      return;
    } else if (callingCell.canActivateNeighbors()) {
      this.getCellNeighbors(callingCell.position)
        .filter(cell => cell.isSafeHidden())
        .forEach(cell => cell.viewState != CellViewState.Flagged && this.updateCell(cell.position, CellViewState.Shown));
    }

    if (this.onlyBombsLeftHidden()) {
      this.gameOver(GameStatus.Won);
    }
  }

  subscribe(observer: IObserver<IGameBoard>) {
    if (!this.observers.find(obs => obs === observer)) {
      this.observers.push(observer);
      observer.update(this);
    }
  }

  unsubscribe(observer: IObserver<IGameBoard>) {
    this.observers = this.observers.filter(obs => obs === observer);
  }

  onlyBombsLeftHidden() {
    const cellsHidden = [...this.cells.values()].filter(cell => cell.viewState != CellViewState.Shown);
    const onlyBombs = cellsHidden.every(cell => cell.value === CellValue.Bomb);
    return onlyBombs;
  }

  isInProgress() {
    return this.status == GameStatus.OnGoing;
  }

  showBoard() {
    if (this.isInProgress()) {
      return;
    }

    for (let cell of this.cells.values()) {
      cell.viewState = CellViewState.Shown;
    }
  }

  gameOver(status: Exclude<GameStatus, 0 | 1>) {
    this.status = status;
    this.showBoard();
    this.emit();
  }

  get isGameOver() {
    return this.status > 1;
  }

  emit() {
    this.observers.forEach(obs => obs.update(this));
  }
}
