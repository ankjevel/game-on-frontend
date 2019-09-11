import JWT from 'JWT'

export const parseJWS = (
  input: string,
  isSplit = false
): MaybeUndefined<JWT> => {
  try {
    return JSON.parse(atob(isSplit ? input : input.split('.')[1]))
  } catch (error) {
    console.error(error)
    return
  }
}

export const isExpired = (exp: JWT['exp']) => {
  const now = Number(`${Date.now()}`.substr(0, `${exp}`.length))

  return now >= exp
}

export const validate = (input: string) => {
  const split = input.split('.')

  if (split.length !== 3) {
    return null
  }

  let json: MaybeUndefined<JWT>
  try {
    json = parseJWS(split[1], true)
  } catch (error) {
    console.error(error)
    return null
  }

  if (isExpired(json.exp)) {
    return null
  }

  return json
}
