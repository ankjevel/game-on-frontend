import Config from 'Config'

export type Method =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH'

let host: Config['api'] = ''
let token: MaybeUndefined<string>

export const setHost = (api: Config['api']) => {
  host = api
}

export const setToken = (newToken: string) => {
  token = newToken
}

export const req = async <T>({
  url,
  method = 'GET',
  body,
  jsonResponse = true,
}: {
  url: string
  method?: Method
  body?: T
  jsonResponse?: boolean
}): Promise<any> => {
  const response = await fetch(`${host}${url}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: typeof body !== 'string' ? JSON.stringify(body) : body,
  })

  if (response.status >= 200 && response.status < 300) {
    return await (jsonResponse ? response.json() : response.text())
  }

  return null
}

export default req
