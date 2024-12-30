import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Game} from '../../model/game';

const YAHTZEE_API_URL = 'http://localhost:8080';

export const yahtzeeApiSlice = createApi({
  reducerPath: 'yahtzeeApi',
  baseQuery: fetchBaseQuery({ baseUrl: YAHTZEE_API_URL }),
  endpoints: (builder) => ({
    getGames: builder.query<Game[], void>({
      query: () => 'games',
    }),
    getGame: builder.query({
      query: (gameId) => `games/${gameId}`,
    }),
    createGame: builder.mutation<Game,{creator:string , number_of_players: number}>({
      query: (body) => ({
        url: '/pending-games',
        method: 'POST',
        body,
      }),
    }),
    rollDice: builder.mutation<Game,{gameId:number, held: number[],player:string}>({
      query: ({ gameId, held ,player}) => ({
        url: `games/${gameId}/actions`,
        method: 'POST',
        body: {type:'reroll', held,player},
      }),
    }),
    registerResult: builder.mutation<Game, {gameId:number,slot:string | number,player:string}>({
      query: ({ gameId, slot,player }) => ({
        url: `games/${gameId}/actions`,
        method: 'POST',
        body: {type:'register', slot, player},
      }),
    }),

    getPendingGames: builder.query<Game[],void>({
      query: () => '/pending-games',
    }),
    getPendingGame: builder.query<Game , number | void>({
      query: (gameId) => `pending-games/${gameId}`,
    }),
    getPendingGamePlayers: builder.query<string[], number>({
      query: (gameId) => `pending-games/${gameId}/players`,
    }),
    addPlayerToPendingGame: builder.mutation<Game,{gameId:number,player:string}>({
      query: ({ gameId, player }) => ({
        url: `pending-games/${gameId}/players`,
        method: 'POST',
        body: {player}
      }),
    }),
    createPendingGame: builder.mutation({
      query: ({ creator, number_of_players }) => ({
        url: 'pending-games',
        method: 'POST',
        body: { creator, number_of_players },
      }),
    }),
  }),
});

export const {
  useGetGameQuery,
  useCreateGameMutation,
  useRollDiceMutation,
  useRegisterResultMutation,
  useGetPendingGamesQuery,
  useGetPendingGameQuery,
  useGetPendingGamePlayersQuery,
  useAddPlayerToPendingGameMutation,
  useCreatePendingGameMutation,
  useGetGamesQuery,
} = yahtzeeApiSlice;