// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { Game } from '../model/game';
// import { RootState } from '../app/store';
// import { useSelector } from 'react-redux';
// import { gameById$, setGameId } from '../Services/gamer-rx-service';
// import {
//   useGetGameQuery,
//   useRollDiceMutation,
//   useRegisterResultMutation,
// } from '../features/yahtzee-game/game-api.slice';
// import calculateSlotScore from '../Services/yahtzee-scour';
// import '../css/game.css';

// function YahtzeeGame() {
//   const { gameId } = useParams<{ gameId: string }>();
//   const [players, setPlayers] = useState<string[]>([]);
//   const playerName = useSelector((state: RootState) => state.player.value);
//   const [currentGame, setCurrentGame] = useState<Game | undefined>(undefined);
//   const { data, refetch } = useGetGameQuery(Number(gameId));
//   const [rollDice] = useRollDiceMutation();
//   const [registerResult] = useRegisterResultMutation();
//   const [selectedDice, setSelectedDice] = useState<boolean[]>([
//     false,
//     false,
//     false,
//     false,
//     false,
//   ]);

//   useEffect(() => {
//     refetch();
//     if (data) {
//       setCurrentGame(data);
//       setPlayers(data.players);
//     }
//   }, [data, refetch]);
//   useEffect(() => {
//     setGameId(Number(gameId));
//     const subscription = gameById$.subscribe((game: Game) => {
//       setCurrentGame(game);
//       setPlayers(game.players);
//     });
//     return () => subscription.unsubscribe();
//   }, [gameId]);
//   const toggleDiceSelection = (index: number) => {
//     if (
//       !currentGame ||
//       currentGame.pending ||
//       currentGame.rolls_left === 0 ||
//       players[currentGame.playerInTurn] !== playerName
//     ) {
//       return;
//     }
//     setSelectedDice((prevSelectedDice) => {
//       const newSelectedDice = [...prevSelectedDice];
//       newSelectedDice[index] = !newSelectedDice[index];
//       return newSelectedDice;
//     });
//   };
//   const handleRollDice = async () => {
//     const selected: number[] = [];
//     selectedDice.forEach((value, index) => {
//       if (value) {
//         selected.push(index);
//       }
//     });
//     await rollDice({
//       gameId: currentGame!.id,
//       held: selected,
//       player: playerName,
//     })
//       .unwrap()
//       .then((game) => {
//         setCurrentGame(game);
//         setSelectedDice([false, false, false, false, false]);
//       })
//       .catch((error) => {
//         console.error('Failed to roll dice:', error);
//       });
//   };
//   const handleRegisterResult = async (slot: number | string) => {
//     await registerResult({
//       gameId: currentGame!.id,
//       slot,
//       player: playerName,
//     })
//       .unwrap()
//       .then((game) => {
//         setCurrentGame(game);
//       })
//       .catch((error) => {
//         console.error('Failed to register result:', error);
//       });
//   };
//   const calculateTotaLScore = (playerIndex: number) => {
//     if (!currentGame) {
//       return 0;
//     }
//     if ('upper_sections' in currentGame && 'lower_sections' in currentGame) {
//       const lowerScore = Object.values(
//         currentGame.lower_sections[playerIndex].scores,
//       ).reduce(
//         (acc: number, score: number | undefined) => acc + (score || 0),
//         0,
//       );
//       const upperScore = Object.values(
//         currentGame.upper_sections[playerIndex].scores,
//       ).reduce(
//         (acc: number, score: number | undefined) => acc + (score || 0),
//         0,
//       );
//       return lowerScore + (upperScore || 0);
//     }
//     return 0;
//   };
//   return (
//     <div>
//       <h1>
//         Game Status: {currentGame?.pending === false ? 'Running' : 'Waiting...'}
//       </h1>
//       <div>
//         <h2>Players:</h2>
//         {players.map((player) => (
//           <h2 key={player}>{player}</h2>
//         ))}
//       </div>
//       {currentGame?.pending === false && (
//         <>
//           <div>
//             <h2>
//               Current Player Turn:{' '}
//               {currentGame?.players[currentGame?.playerInTurn]}
//             </h2>
//             <h2>Rolls Left: {currentGame?.rolls_left}</h2>
//             <h2>Current Dice:</h2>
//             <div className="dice-container">
//               {currentGame?.roll.map((value, index) => (
//                 <button
//                   key={index}
//                   className={`dice-value ${selectedDice[index] ? 'selected' : ''}`}
//                   onClick={() => toggleDiceSelection(index)}
//                 >
//                   {value}
//                 </button>
//               ))}
//             </div>
//             {players[currentGame.playerInTurn] === playerName &&
//               currentGame.rolls_left > 0 && (
//                 <button onClick={handleRollDice}>Roll Dice</button>
//               )}
//           </div>
//           <div className="yahtzee-board">
//             <h2>Yahtzee Board</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Player</th>
//                   <th>Ones</th>
//                   <th>Twos</th>
//                   <th>Threes</th>
//                   <th>Fours</th>
//                   <th>Fives</th>
//                   <th>Sixes</th>
//                   <th>Three of a Kind</th>
//                   <th>Four of a Kind</th>
//                   <th>Full House</th>
//                   <th>Small Straight</th>
//                   <th>Large Straight</th>
//                   <th>Yahtzee</th>
//                   <th>Chance</th>
//                   <th>Total Score</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentGame?.players.map((player) => (
//                   <tr key={player}>
//                     <td>{player}</td>
//                     <td onDoubleClick={() => handleRegisterResult(1)}>
//                       {currentGame.upper_sections[players.indexOf(player)]
//                         ?.scores[1] as number ||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(currentGame.roll, 1)}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td onDoubleClick={() => handleRegisterResult(2)}>
//                       {currentGame.upper_sections[players.indexOf(player)]
//                         ?.scores[2] as number ||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(currentGame.roll, 2)}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td onDoubleClick={() => handleRegisterResult(3)}>
//                       {currentGame.upper_sections[players.indexOf(player)]
//                         ?.scores[3] as number ||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(currentGame.roll, 3)}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td onDoubleClick={() => handleRegisterResult(4)}>
//                       {currentGame.upper_sections[players.indexOf(player)]
//                         ?.scores[4] as number||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(currentGame.roll, 4)}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td onDoubleClick={() => handleRegisterResult(5)}>
//                       {currentGame.upper_sections[players.indexOf(player)]
//                         ?.scores[5] as number ||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(currentGame.roll, 5)}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td onDoubleClick={() => handleRegisterResult(6)}>
//                       {currentGame.upper_sections[players.indexOf(player)]
//                         ?.scores[6] as number ||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(currentGame.roll, 6)}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td
//                       onDoubleClick={() =>
//                         handleRegisterResult('three of a kind')
//                       }
//                     >
//                       {currentGame.lower_sections[players.indexOf(player)]
//                         ?.scores['three of a kind'] as number||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(
//                               currentGame.roll,
//                               'three of a kind',
//                             )}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td
//                       onDoubleClick={() =>
//                         handleRegisterResult('four of a kind')
//                       }
//                     >
//                       {currentGame.lower_sections[players.indexOf(player)]
//                         ?.scores['four of a kind'] as number ||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(
//                               currentGame.roll,
//                               'four of a kind',
//                             )}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td
//                       onDoubleClick={() => handleRegisterResult('full house')}
//                     >
//                       {currentGame.lower_sections[players.indexOf(player)]
//                         ?.scores['full house'] as number||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(currentGame.roll, 'full house')}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td
//                       onDoubleClick={() =>
//                         handleRegisterResult('small straight')
//                       }
//                     >
//                       {currentGame.lower_sections[players.indexOf(player)]
//                         ?.scores['small straight'] as number  ||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(
//                               currentGame.roll,
//                               'small straight',
//                             )}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td
//                       onDoubleClick={() =>
//                         handleRegisterResult('large straight')
//                       }
//                     >
//                       {currentGame.lower_sections[players.indexOf(player)]
//                         ?.scores['large straight'] as number||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(
//                               currentGame.roll,
//                               'large straight',
//                             )}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td onDoubleClick={() => handleRegisterResult('yahtzee')}>
//                       {currentGame.lower_sections[players.indexOf(player)]
//                         ?.scores.yahtzee as number||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(currentGame.roll, 'yahtzee')}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td onDoubleClick={() => handleRegisterResult('chance')}>
//                       {currentGame.lower_sections[players.indexOf(player)]
//                         ?.scores.chance as number||
//                         (currentGame.playerInTurn ===
//                         players.indexOf(player) ? (
//                           <span style={{ color: 'red' }}>
//                             {calculateSlotScore(currentGame.roll, 'chance')}
//                           </span>
//                         ) : (
//                           '--'
//                         ))}
//                     </td>
//                     <td>{calculateTotaLScore(players.indexOf(player))}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
// export default YahtzeeGame;
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Game, GameIndex } from '../model/game';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { gameById$, setGameId } from '../Services/gamer-rx-service';
import {
  useGetGameQuery,
  useRollDiceMutation,
  useRegisterResultMutation,
} from '../features/yahtzee-game/game-api.slice';
import calculateSlotScore from '../Services/yahtzee-scour';
import '../css/game.css';
import { IndexedGame } from '../../../server/src/servermodel';

function YahtzeeGame() {
  const { gameId } = useParams<{ gameId: string }>();
  const [players, setPlayers] = useState<string[]>([]);
  const playerName = useSelector((state: RootState) => state.player.value);
  const [currentGame, setCurrentGame] = useState<IndexedGame | undefined>(
    undefined,
  );
  const { data, refetch } = useGetGameQuery(Number(gameId));
  const [rollDice] = useRollDiceMutation();
  const [registerResult] = useRegisterResultMutation();
  const [selectedDice, setSelectedDice] = useState<boolean[]>(
    Array(5).fill(false),
  );

  useEffect(() => {
    refetch();
    if (data) {
      setCurrentGame(data);
      setPlayers(data.players);
    }
  }, [data, refetch]);

  useEffect(() => {
    setGameId(Number(gameId));
    const subscription = gameById$.subscribe((game: Game) => {
      setCurrentGame(game as IndexedGame);
      setPlayers(game.players);
    });
    return () => subscription.unsubscribe();
  }, [gameId]);

  const toggleDiceSelection = (index: number) => {
    if (
      !currentGame ||
      currentGame.pending ||
      currentGame.rolls_left === 0 ||
      players[currentGame.playerInTurn] !== playerName
    ) {
      return;
    }
    setSelectedDice((prevSelectedDice) => {
      const newSelectedDice = [...prevSelectedDice];
      newSelectedDice[index] = !newSelectedDice[index];
      return newSelectedDice;
    });
  };

  const handleRollDice = async () => {
    const selected = selectedDice
      .map((value, index) => value && index)
      .filter(Boolean) as number[];
    try {
      const game = await rollDice({
        gameId: currentGame!.id,
        held: selected,
        player: playerName,
      }).unwrap();
      setCurrentGame(game as IndexedGame);
      setSelectedDice(Array(5).fill(false));
    } catch (error) {
      console.error('Failed to roll dice:', error);
    }
  };

  const handleRegisterResult = async (slot: number | string) => {
    try {
      const game = await registerResult({
        gameId: currentGame!.id,
        slot,
        player: playerName,
      }).unwrap();
      setCurrentGame(game);
    } catch (error) {
      console.error('Failed to register result:', error);
    }
  };

  const calculateTotalScore = (playerIndex: number) => {
    if (!currentGame) {
      return 0;
    }
    const upperScores =
      (currentGame as GameIndex).upper_sections[playerIndex]?.scores || {};
    const lowerScores =
      (currentGame as GameIndex).lower_sections[playerIndex]?.scores || {};

    const upperScore = Object.values(upperScores).reduce(
      (acc, score) => acc + (score || 0),
      0,
    );
    const lowerScore = Object.values(lowerScores).reduce(
      (acc, score) => acc + (score || 0),
      0,
    );

    return Number(upperScore) + Number(lowerScore);
  };

  const scoreCategories = [
    { label: 'Ones', slot: 1 },
    { label: 'Twos', slot: 2 },
    { label: 'Threes', slot: 3 },
    { label: 'Fours', slot: 4 },
    { label: 'Fives', slot: 5 },
    { label: 'Sixes', slot: 6 },
    { label: 'Three of a Kind', slot: 'three of a kind' },
    { label: 'Four of a Kind', slot: 'four of a kind' },
    { label: 'Full House', slot: 'full house' },
    { label: 'Small Straight', slot: 'small straight' },
    { label: 'Large Straight', slot: 'large straight' },
    { label: 'Yahtzee', slot: 'yahtzee' },
    { label: 'Chance', slot: 'chance' },
    { label: 'Total Score', slot: 'total' },
  ];

  return (
    <div>
      <h1>
        Game Status: {currentGame?.pending === false ? 'Running' : 'Waiting...'}
      </h1>
      <div>
        <h2>Players:</h2>
        {players.map((player) => (
          <h2 key={player}>{player}</h2>
        ))}
      </div>
      {currentGame?.pending === false && (
        <>
          <div>
            <h2>
              Current Player Turn:{' '}
              {currentGame.players[currentGame.playerInTurn]}
            </h2>
            <h2>Rolls Left: {currentGame.rolls_left}</h2>
            <h2>Current Dice:</h2>
            <div className="dice-container">
              {currentGame.roll.map((value, index) => (
                <button
                  key={index}
                  className={`dice-value ${selectedDice[index] ? 'selected' : ''}`}
                  onClick={() => toggleDiceSelection(index)}
                  disabled={
                    currentGame.rolls_left === 0 ||
                    players[currentGame.playerInTurn] !== playerName
                  }
                >
                  {value}
                </button>
              ))}
            </div>
            {players[currentGame.playerInTurn] === playerName &&
              currentGame.rolls_left > 0 && (
                <button onClick={handleRollDice}>Roll Dice</button>
              )}
          </div>
          <div className="yahtzee-board">
            <h2>Yahtzee Board</h2>
            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
                margin: 'auto',
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '8px' }}>
                    Category
                  </th>
                  {players.map((player) => (
                    <th
                      key={player}
                      style={{ border: '1px solid black', padding: '8px' }}
                    >
                      {player}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoreCategories.map(({ label, slot }) => (
                  <tr key={label}>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      {label}
                    </td>
                    {players.map((player, playerIndex) => (
                      <td
                        key={player}
                        style={{
                          border: '1px solid black',
                          padding: '8px',
                          textAlign: 'center',
                        }}
                      >
                        {slot === 'total' ? (
                          calculateTotalScore(playerIndex)
                        ) : currentGame.upper_sections[playerIndex]?.scores[slot] !== undefined ? (
                          currentGame.upper_sections[playerIndex]?.scores[slot]
                        ) : currentGame.lower_sections[playerIndex]?.scores[slot] !== undefined ? (
                          currentGame.lower_sections[playerIndex]?.scores[slot]
                        ) : currentGame.playerInTurn === playerIndex ? (
                          <span onDoubleClick={()=>handleRegisterResult(slot)} style={{ color: 'red' }}>
                            {calculateSlotScore(currentGame.roll, slot)}
                          </span>
                        ) : (
                          '--'
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default YahtzeeGame;
