import { PositionToken, SimplePosition } from "./models/types";

/**
 *
 * @param likelyhood chance of true where 1 is 100% and 0 is 0%
 */
export function getRandomChance(likelyhood: number) {
  return Math.random() < likelyhood;
}


export function getPositionToken({ row, column }: SimplePosition): PositionToken {
  return `row=${row};column=${column}`;
}
