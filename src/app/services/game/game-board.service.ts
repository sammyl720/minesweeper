import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, map, Observable, ReplaySubject, sample, startWith, Subscription, switchMap, takeWhile } from 'rxjs';
import { ICell } from 'src/models/Cell';
import { GameGrid } from 'src/models/game-grid';
import { DifficultyLevel, GameSize, GameState, IGameState } from 'src/models/game-state';
import { GameBoard, IGameBoard } from 'src/models/game-board';
import { IObserver } from 'src/models/observable';
import { CellViewState, GameStatus } from 'src/models/types';
import { DEFAULT_DIFFICULTY_LEVEL, DEFAULT_GAME_SIZE, DEFAULT_GAME_TIME } from 'src/models/settings';
@Injectable({
  providedIn: 'root'
})
export class GameBoardService implements IObserver<IGameBoard>, OnDestroy {

  gameTime$ = new BehaviorSubject<number>(DEFAULT_GAME_TIME);
  gameSize$ = new BehaviorSubject<GameSize>(DEFAULT_GAME_SIZE);
  difficultyLevel$ = new BehaviorSubject<DifficultyLevel>(DEFAULT_DIFFICULTY_LEVEL);
  bombs$: Observable<number>;
  gameUpdates$ = new ReplaySubject<IGameBoard>(1);
  newGame$ = new BehaviorSubject<boolean>(true);
  gameEmoji$: Observable<string>;

  gameState$: Observable<IGameState>;

  gameBoard: GameBoard | null = null;

  gameSub: Subscription;

  constructor() {

    this.bombs$ = combineLatest([
      this.difficultyLevel$,
      this.gameSize$
    ]).pipe(map(([level, size]) => {
      const squareSize: number = size ** 2;
      const levelAsAPercent = Math.round(level / 100);
      return Math.round(squareSize * levelAsAPercent)
    }));

    this.gameState$ = combineLatest([
      this.gameTime$,
      this.gameSize$,
      this.bombs$
    ]).pipe(
      map(([timeRemaining, gameSize, bombs]) => {
        return new GameState(timeRemaining, gameSize, bombs)
      })
    )

    this.gameEmoji$ = this.gameUpdates$.pipe(

      map(game => {
        switch (game.status) {
          case GameStatus.None:
            return '😐';
          case GameStatus.OnGoing:
            return '😃';
          case GameStatus.Won:
            return '😎';
          case GameStatus.Lost:
            return '😖';
          case GameStatus.TimeOut:
            return '😔';
          default:
            return '😁';
        }
      }))

    this.gameSub = this.newGame$.pipe(
      switchMap(() => {
        return this.gameState$
      }
      )).subscribe(({ timeRemaining, size, bombsInBoard }) => {
        if (this.gameBoard) {
          this.gameBoard.unsubscribe(this)
        }
        this.gameBoard = new GameBoard(
          new GameGrid(size),
          bombsInBoard,
          timeRemaining
        )
        this.gameBoard.subscribe(this);
      });
  }

  update(subject: IGameBoard) {
    let startNewGame = false;
    if (subject.status != GameStatus.OnGoing) {
      let gameOverMessage = "";
      switch (subject.status) {
        case GameStatus.Won:
          gameOverMessage = "Wohoo!! You Won!";
          break;
        case GameStatus.Lost:
          gameOverMessage = "Oops! That was a bomb. Better luck next time."
          break;
        case GameStatus.TimeOut:
          gameOverMessage = "Tick Tock, You ran out of time."
          break;
        default:
          break;
      }
      startNewGame = !!gameOverMessage;
    }

    this.gameUpdates$.next(subject);
  }

  updateCell(cell: ICell) {
    const nextViewState = cell.hasFlag() ? CellViewState.Hidden : CellViewState.Shown;
    this.gameBoard?.updateCell(cell.position, nextViewState);
  }

  flagCell(cell: ICell) {
    if (cell.isShown()) {
      return;
    }

    const newViewState = cell.hasFlag() ? CellViewState.Hidden : CellViewState.Flagged;

    this.gameBoard?.updateCell(cell.position, newViewState);
  }

  newGame() {
    this.newGame$.next(true);
  }

  updateSize(size: GameSize) {
    this.gameSize$.next(size);
    this.newGame();
  }

  updateDifficulty(level: DifficultyLevel) {
    this.difficultyLevel$.next(level);
    this.newGame();
  }

  notify() {

  }

  ngOnDestroy(): void {
    this.gameSub.unsubscribe();
    this.gameBoard?.unsubscribe(this);
  }
}
