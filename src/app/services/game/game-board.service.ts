import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilKeyChanged, interval, map, switchMap, takeWhile } from 'rxjs';
import { GameGrid } from 'src/models/game-grid';
import { GameState } from 'src/models/game-state';
import { GameBoard } from 'src/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {

  gameTime$ = new BehaviorSubject<number>(600);
  gameSize$ = new BehaviorSubject<number>(10);
  timeRemaining$ = this.gameTime$.pipe(
    switchMap(gameTime => interval(1000).pipe(
      map(time => gameTime - time),
      takeWhile(time => !!time)
    ))
  )

  gameState$ = combineLatest([
    this.timeRemaining$,
    this.gameSize$
  ]).pipe(
    map(([timeRemaining, gameSize]) => {
      return new GameState(timeRemaining, gameSize)
    })
  );

  gameBoard$ = this.gameState$.pipe(
    distinctUntilKeyChanged('size'),
    map(state =>
      new GameBoard(new GameGrid(state.size))
    )
  )

  constructor() { }
}
