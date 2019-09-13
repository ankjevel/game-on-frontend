import { NewGroup } from '../types/Api'
import { parseJWS, isExpired, validate } from './jwt'
import req, { Method, setHost, setToken } from './req'

export { Method, setHost, setToken, req, parseJWS, isExpired, validate }

export const config = {
  get() {
    return req({ url: '/js/config.json' })
  },
}

export const user = {
  create(input: { name: string; email: string; p1: string; p2: string }) {
    return req({
      url: '/user',
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
  newToken(input: { email: string; password: string }) {
    return req({
      url: '/user/token',
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
  validToken(token: string) {
    return req({ url: '/user/valid-token', token })
  },
  group() {
    return req({ url: '/user/group' })
  },
}

export const group = {
  create(body: NewGroup) {
    return req({
      url: '/group',
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  join(id: string) {
    return req({
      url: `/group/${id}/join`,
      method: 'PUT',
    })
  },

  leave(id: string) {
    return req({
      url: `/group/${id}/leave`,
      method: 'DELETE',
    })
  },
}

export default {
  config,
  user,
  group,
}
