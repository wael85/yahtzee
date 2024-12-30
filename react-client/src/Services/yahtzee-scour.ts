const calculateSlotScore = (dices: number[], slot: number | string): number => {
    const countOccurrences = (num: number) => dices.filter(dice => dice === num).length;
  
    // Helper functions for specific checks
    const isThreeOfAKind = () => dices.some(dice => countOccurrences(dice) >= 3);
    const isFourOfAKind = () => dices.some(dice => countOccurrences(dice) >= 4);
    const isFullHouse = () => {
      const uniqueValues = Array.from(new Set(dices));
      return uniqueValues.length === 2 && (countOccurrences(uniqueValues[0]) === 3 || countOccurrences(uniqueValues[0]) === 2);
    };
    const isSmallStraight = () => {
      const straights = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
      ];
      return straights.some(straight => straight.every(num => dices.includes(num)));
    };
    const isLargeStraight = () => {
      const sortedDices = Array.from(new Set(dices)).sort((a, b) => a - b);
      const largeStraight = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];
      return largeStraight.some(straight => JSON.stringify(sortedDices) === JSON.stringify(straight));
    };
    const isYahtzee = () => new Set(dices).size === 1;
  
    switch (slot) {
      case 1:
        return dices.filter(dice => dice === 1).length * 1;
      case 2:
        return dices.filter(dice => dice === 2).length * 2;
      case 3:
        return dices.filter(dice => dice === 3).length * 3;
      case 4:
        return dices.filter(dice => dice === 4).length * 4;
      case 5:
        return dices.filter(dice => dice === 5).length * 5;
      case 6:
        return dices.filter(dice => dice === 6).length * 6;
      case 'three of a kind':
        return isThreeOfAKind() ? dices.reduce((acc, dice) => acc + dice, 0) : 0;
      case 'four of a kind':
        return isFourOfAKind() ? dices.reduce((acc, dice) => acc + dice, 0) : 0;
      case 'full house':
        return isFullHouse() ? 25 : 0;
      case 'small straight':
        return isSmallStraight() ? 30 : 0;
      case 'large straight':
        return isLargeStraight() ? 40 : 0;
      case 'yahtzee':
        return isYahtzee() ? 50 : 0;
      case 'chance':
        return dices.reduce((acc, dice) => acc + dice, 0);
      default:
        return 0;
    }
  };
  export default calculateSlotScore;