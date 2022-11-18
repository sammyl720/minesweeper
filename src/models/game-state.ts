import { GameStatus } from "./types";

export interface IGameState {
  /**
   * The size of the game: 10 = (10x10)
   */
  size: number,
  /**
   * Is this game on going
   */
  status: GameStatus,
  /**
   * Time remaining in seconds
   */
  timeRemaining: number;
}
