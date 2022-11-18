import { GameGrid } from "./game-grid";
import { GameBoard, IGameBoard } from "./interfaces";
import { GameStatus } from "./types";

export interface IGameState {
  /**
   * The size of the game: 10 = (10x10)
   */
  size: number,
  /**
   * Time remaining in seconds
   */
  timeRemaining: number;
}

export class GameState implements IGameState {
  size: number;
  timeRemaining: number;

  public constructor(
    time = 600,
    size = 10,
  ) {
    this.size = size;
    this.timeRemaining = time;
  }

}
