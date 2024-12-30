import { IndexedGame, PendingGame } from '../../../server/src/servermodel';

export type Game = IndexedGame | PendingGame;
export type GameIndex = IndexedGame;
export type GamePending = PendingGame;
