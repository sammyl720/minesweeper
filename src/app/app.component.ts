import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameState } from 'src/models/game-state';
import { GameBoard, IGameBoard } from 'src/models/game-board';
import { GameBoardService } from './services/game/game-board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'minesweeper';
  gameState$: Observable<GameState>;
  gameSize$: Observable<number>;
  gameUpdates$: Observable<IGameBoard>;


  constructor(
    public gameService: GameBoardService
  ) {
    this.gameState$ = this.gameService.gameState$;
    this.gameSize$ = this.gameService.gameSize$;
    this.gameUpdates$ = this.gameService.gameUpdates$;
  }
}
