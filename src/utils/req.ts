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
export const setHost = (api: Config['api']) => {
  host = api
}

export const req = async <T>({
  url,
  method = 'GET',
  body,
}: {
  url: string
  method?: Method
  body?: T
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
    return await response.json()
  }

  return null
}

export default req
