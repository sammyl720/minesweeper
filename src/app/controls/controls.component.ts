import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { DifficultyLevel, GameSize } from 'src/models/game-state';
import { GameBoardService } from '../services/game/game-board.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  DifficultyLevel = DifficultyLevel;
  GameSize = GameSize;
  gameEmoji$: Observable<string>;

  timeLeft$: Observable<number>;

  constructor(
    private gameService: GameBoardService
  ) {
    this.timeLeft$ = this.gameService.gameUpdates$.pipe(
      switchMap(game => game.timeRemaining$)
    );
    this.gameEmoji$ = this.gameService.gameEmoji$;
  }

  ngOnInit(): void {
  }

  updateLevel(level: DifficultyLevel) {
    this.gameService.updateDifficulty(level);
  }

  updateSize(size: GameSize) {
    this.gameService.updateSize(size);
  }


  newGame() {
    this.gameService.newGame();
  }
}
