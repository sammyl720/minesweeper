import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameState } from 'src/models/game-state';
import { GameBoard } from 'src/models/interfaces';
import { GameBoardService } from './services/game/game-board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'minesweeper';
  gameBoard$: Observable<GameBoard>;
  gameState$: Observable<GameState>;
  gameSize$: Observable<number>;

  constructor(
    public gameService: GameBoardService
  ) {
    this.gameBoard$ = this.gameService.gameBoard$;
    this.gameState$ = this.gameService.gameState$;
    this.gameSize$ = this.gameService.gameSize$;
  }
}
