export enum Hand {
  RoyalFlush = 0,
  StraightFlush = 1,
  FourOfAKind = 2,
  FullHouse = 3,
  Flush = 4,
  Straight = 5,
  ThreeOfAKind = 6,
  TwoPair = 7,
  Pair = 8,
  HighCard = 9,
}

export const hand = (hand: Hand) => {
  let text: string

  switch (hand) {
    case Hand.RoyalFlush:
      text = 'Royal flush'
      break
    case Hand.StraightFlush:
      text = 'Straight flush'
      break
    case Hand.FourOfAKind:
      text = 'Four of a kind'
      break
    case Hand.FullHouse:
      text = 'Full house'
      break
    case Hand.Flush:
      text = 'Flush'
      break
    case Hand.Straight:
      text = 'Straight'
      break
    case Hand.ThreeOfAKind:
      text = 'Three of a kind'
      break
    case Hand.TwoPair:
      text = 'Two pair'
      break
    case Hand.Pair:
      text = 'Pair'
      break
    case Hand.HighCard:
      text = 'High card'
      break
    default:
      return null
  }

  return text
}

export default hand
