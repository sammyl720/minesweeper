import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ICell } from 'src/models/Cell';
import { IGameBoard } from 'src/models/game-board';
import { CellValue, CellViewState } from 'src/models/types';
import { GameBoardService } from '../services/game/game-board.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  CellViewState = CellViewState;
  game$: Observable<IGameBoard>;
  gameCells$: Observable<ICell[]>;
  size$: Observable<number>;
  CellValue = CellValue;

  @HostBinding('style.--size') get size() {
    return this.size$;
  }

  constructor(
    private gameService: GameBoardService
  ) {
    this.game$ = this.gameService.gameUpdates$;
    this.gameCells$ = this.gameService.gameUpdates$.pipe(
      map(game => [...game.cells.values()])
    )

    this.size$ = this.gameService.gameUpdates$.pipe(
      map(game => game.grid.square)
    );
  }

  ngOnInit(): void {
  }

  selectCell(cell: ICell) {
    this.gameService.updateCell(cell);
  }

  flagCell(cell: ICell) {
    this.gameService.flagCell(cell);
    return false;
  }
}
