enum Card {
  Spades = 0xa0,
  Hearts = 0xb0,
  Diamonds = 0xc0,
  Clubs = 0xd0,
}

export const toHex = (input: string) =>
  (0x1f000 | parseInt(input, 16)).toString(16)

export const toString = (input: string) => `&#x${toHex(input)};`

export const html = (input: string) => ({
  __html: toString(input),
})

export const isRed = (input: string) => {
  const number = parseInt(input, 16)

  if ((number ^ Card.Hearts) <= 14 || (number ^ Card.Diamonds) <= 14) {
    return true
  }

  return false
}

export default toString
