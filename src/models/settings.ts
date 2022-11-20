import { DifficultyLevel, GameSize } from "./game-state";
import { IOptionGroup } from "./types";

export const DEFAULT_GAME_TIME = 300;
export const DEFAULT_DIFFICULTY_LEVEL: DifficultyLevel = DifficultyLevel.Easy;
export const DEFAULT_GAME_SIZE: GameSize = GameSize.Small;

export const DEFAULT_GAME_LEVEL_OPTIONS_GROUP: IOptionGroup<DifficultyLevel> = {
  header: 'Difficulty',
  options: [
    {
      label: 'Easy',
      value: DifficultyLevel.Easy
    },
    {
      label: 'Medium',
      value: DifficultyLevel.Medium
    },
    {
      label: 'Hard',
      value: DifficultyLevel.Hard
    }
  ]
};

export const DEFAULT_GAME_SIZE_OPTIONS_GROUP: IOptionGroup<GameSize> = {
  header: 'Size',
  options: [
    {
      label: 'Small',
      value: GameSize.Small
    },
    {
      label: 'Medium',
      value: GameSize.Medium
    },
    {
      label: 'Large',
      value: GameSize.Large
    }
  ]

}
