import {
  UserRoutes,
  ConfigRoutes,
  GroupRoutes,
  ListRoutes,
  ActionRoutes,
} from '../types/Api'
import { parseJWS, isExpired, validate } from './jwt'
import req, { Method, setHost, setToken } from './req'

type ID = 'group' | 'action' | 'user'

const formatID = (id: string, type: ID) =>
  id.includes(`${type}:`) ? id : `${type}:${id}`

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
      url: `/group/${formatID(id, 'group')}`,
      method: 'PUT',
    })
  },

  leave(id) {
    return req({
      url: `/group/${formatID(id, 'group')}`,
      method: 'DELETE',
    })
  },

  update(id, body) {
    return req({
      url: `/group/${formatID(id, 'group')}`,
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },

  order(id, body) {
    return req({
      url: `/group/${formatID(id, 'group')}/order`,
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  start(id) {
    return req({
      url: `/group/${formatID(id, 'group')}/start`,
      method: 'POST',
    })
  },
}

export const list: ListRoutes = {
  get(id, type) {
    return req({
      url: `/get/${formatID(id, type)}/${type}`,
      method: 'GET',
    })
  },
}

export const action: ActionRoutes = {
  newAction(actionID, groupID, body) {
    const aID = formatID(actionID, 'action')
    const gID = formatID(groupID, 'group')

    return req({
      url: `/get/${aID}/${gID}`,
      method: 'POST',
      body: JSON.stringify(body),
    })
  },
}

export default {
  list,
  config,
  user,
  group,
  action,
}
