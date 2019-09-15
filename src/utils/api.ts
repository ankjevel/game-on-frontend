import {
  NewGroup,
  UserRoutes,
  ConfigRoutes,
  GroupRoutes,
  ListRoutes,
} from '../types/Api'
import { parseJWS, isExpired, validate } from './jwt'
import req, { Method, setHost, setToken } from './req'

export { Method, setHost, setToken, req, parseJWS, isExpired, validate }

export const config: ConfigRoutes = {
  get() {
    return req({ url: '/js/config.json' })
  },
}

export const user: UserRoutes = {
  create(input) {
    return req({
      url: '/user',
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  newToken(input) {
    return req({
      url: '/user/token',
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  validToken(token) {
    return req({ url: '/user/valid-token', token })
  },

  group() {
    return req({ url: '/user/group' })
  },
}

export const group: GroupRoutes = {
  create(body) {
    return req({
      url: '/group',
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  join(id) {
    return req({
      url: `/group/${id.startsWith('group:') ? id : `group:${id}`}`,
      method: 'PUT',
    })
  },

  leave(id) {
    return req({
      url: `/group/${id.startsWith('group:') ? id : `group:${id}`}`,
      method: 'DELETE',
    })
  },

  update(id, body) {
    return req({
      url: `/group/${id.startsWith('group:') ? id : `group:${id}`}`,
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },

  order(id, body) {
    return req({
      url: `/group/${id.includes('group:') ? id : `group:${id}`}/order`,
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  start(id) {
    return req({
      url: `/group/${id.includes('group:') ? id : `group:${id}`}/start`,
      method: 'POST',
    })
  },
}

export const list: ListRoutes = {
  get(id, type) {
    return req({
      url: `/get/${id.includes(`${type}:`) ? id : `${type}:${id}`}/${type}`,
      method: 'GET',
    })
  },
}

export default {
  config,
  user,
  group,
}
