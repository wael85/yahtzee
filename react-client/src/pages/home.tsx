import { useState, useEffect} from 'react';
import { login, logout } from '../features/player/player-slice';
import {
  useGetPendingGamesQuery,
  useCreateGameMutation,
  useGetGamesQuery,
  useAddPlayerToPendingGameMutation,
} from '../features/yahtzee-game/game-api.slice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Game } from '../model/game';
import { newGame$ } from '../Services/gamer-rx-service';
import { useNavigate ,useLocation} from 'react-router-dom';
import "../app.css";



export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const playerName = useSelector((state: RootState) => state.player.value);
  const [name, setName] = useState('');
  const { data: pendingGamesData = [], isLoading: isLoadingPendingGames ,refetch: refetchPendingGames } = useGetPendingGamesQuery();
  const { data: gamesData = [], isLoading: isLoadingGames, refetch: refetchGames } = useGetGamesQuery();
  const [pendingGames, setPendingGames] = useState<Game[]>(pendingGamesData);
  const [createGame] = useCreateGameMutation();
  const [addPlayer] = useAddPlayerToPendingGameMutation();
  useEffect(() => {
    
    if (pendingGamesData.length > 0) {
      setPendingGames(pendingGamesData);
    }
  }, [pendingGamesData]);

  useEffect(() => {
    refetchGames();
    refetchPendingGames();
  }, [location, refetchGames, refetchPendingGames]);
  useEffect(() => {
    const subscription = newGame$.subscribe((game) => {
      setPendingGames((prevData) => [...prevData, game]);
      console.log('game:', game);
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleLogin = () => {
    dispatch(login(name));
    refetchPendingGames();
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  const handleCreateGame = async () => {
    try {
      await createGame({ creator: playerName, number_of_players: 2 }).unwrap();
      // navigate(`/pending-games/${createdGame.id}`); // Navigate to the created game page
    } catch (error) {
      console.error('Failed to create game:', error);
    }

  };
  const handleJoinGame = (gameId: number) => {
    const game = pendingGames.find((g) => g.id === gameId);
    if (game && !game.players.includes(playerName)) {
      addPlayer({ gameId, player: playerName });
    }
    navigate(`/pending-games/${gameId}`);
  };
  return (
    <div>
      <h1>Home</h1>

      {playerName ? (
        <div>
          <h2>Hello, {playerName}!</h2>
          <div>
            <button onClick={handleLogout}>log out</button>
          </div>
        </div>
      ) : (
        <div>
          <input
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleLogin}>log in</button>
        </div>
      )}
      {playerName && (
        <div>
          <button onClick={handleCreateGame}>Create new game</button>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h4>Pending Yahtzee games</h4>
              {isLoadingPendingGames ? (
                'Loading...'
              ) : (
                <div>
                  {pendingGames.map((game: Game) => (
                    <div key={game.id}>
                      <p>{game.id}</p>
                      <button onClick={()=>handleJoinGame(game.id)}>Join</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4>My Running Yahtzee games</h4>
              {isLoadingGames ? (
                'Loading...'
              ) : (
                <div>
                  {gamesData.filter(g => g.players.includes(playerName)).map((game: Game) => (
                    <div key={game.id}>
                      <p>{game.id}</p>
                      <button onClick={()=>handleJoinGame(game.id)}>Go to Game</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
