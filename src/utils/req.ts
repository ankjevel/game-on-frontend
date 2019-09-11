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

export const req = async <T>({
  url,
  method = 'GET',
  body,
  host,
}: {
  host: string
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
    body: body && JSON.stringify(body),
  })
  return await response.json()
}

export default req
