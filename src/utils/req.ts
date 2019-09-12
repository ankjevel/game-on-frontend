import Config from 'CConfig'

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

let token: MaybeUndefined<string>
export const setToken = (newToken: string) => {
  token = newToken
}

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
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
      ...headers,
      Authorization: token && `Bearer ${token}`,
    },
    body: typeof body !== 'string' ? JSON.stringify(body) : body,
  })

  if (response.status >= 200 && response.status < 300) {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    return await response.text()
  }

  return null
}

export default req
