import { webSocket } from 'rxjs/webSocket';
import { Subject, filter, BehaviorSubject, switchMap } from 'rxjs';
import { Game } from '../model/game';

const socket = webSocket<any>({
  url: 'ws://localhost:9090/publish',
  openObserver: {
    next: () => {
      console.log('WebSocket connection established');
      socket.next({ type: 'subscribe' });
    },
  },
  closeObserver: {
    next: () => {
      console.log('WebSocket connection closed');
    },
  },
});

const messageSubject = new Subject<Game>();

// Subscribe to the WebSocket to receive messages
socket.subscribe(
  (message) => {
    messageSubject.next(message);
  },
  (err) => console.error('error: ', err),
  () => console.warn('Completed!'),
);

const gameIdSubject = new BehaviorSubject<number | null>(null);
const gameSubject = new Subject<Game>();
const filteredGameById$ = gameIdSubject.pipe(
  switchMap((gameId) =>
    messageSubject.pipe(filter((message) => message.id === gameId)),
  ),
);
filteredGameById$.subscribe(
  (game) => {
    console.log('game from rx : ', game);
    gameSubject.next(game);
  },
  (err) => console.error('error: ', err),
  () => console.warn('Completed!'),
);

const filteredNewGame$ = messageSubject.pipe(
  filter((message) => message.pending === true),
);

const newGameSubject = new Subject<Game>();
filteredNewGame$.subscribe(
  (newGame) => {
    newGameSubject.next(newGame);
  },
  (err) => console.error('error: ', err),
  () => console.warn('Completed!'),
);

export const newGame$ = newGameSubject.asObservable();
export const gameById$ = gameSubject.asObservable();
export const setGameId = (gameId: number) => {
  gameIdSubject.next(gameId);
};
