import { GameGrid } from "./game-grid";
import { GameBoard, IGameBoard } from "./game-board";
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
  bombsInBoard: number;
}

export class GameState implements IGameState {
  size: number;
  timeRemaining: number;
  bombsInBoard: number;

  public constructor(
    time = 600,
    size = 10,
    bombsInBoard = 20
  ) {
    this.size = size;
    this.timeRemaining = time;
    this.bombsInBoard = bombsInBoard
  }

}


export enum DifficultyLevel {
  Easy = 20,
  Medium = 30,
  Hard = 40
}

export enum GameSize {
  Small = 10,
  Medium = 20,
  Large = 30
}
