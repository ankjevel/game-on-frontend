import React, { useContext, useState, SFC, Fragment } from 'react'

import './App.css'

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { RouteParams, IMaybeRedirect, ERoute, IRoute } from '../../types/Route'
import userContext from '../../context/User'
import actionContext from '../../context/Action'
import Action from '../Action'
import CreateOrJoinGroup from '../CreateOrJoinGroup'
import Group from '../Group'
import SignIn from '../SignIn'
import api from '../../utils/api'

export const App = () => {
  const user = useContext(userContext)
  const action = useContext(actionContext)
  const [render, updateRender] = useState(false)
  const [active, updateActive] = useState(false)

  const pretty = (key: string) => {
    return key.replace(/^.+?:/, '')
  }

  const checkState = (): ERoute => {
    if (user.id === '') {
      return '/sign-in'
    }

    if (user.group == null) {
      return '/create'
    }

    if (user.group.action != null && action.action == null) {
      return '/wait'
    }

    if (
      user.group.action != null &&
      action.action != null &&
      user.group.action === action.action.id
    ) {
      return '/action'
    }

    if (user.group.users.find(({ id }) => id === user.id) == null) {
      return '/create'
    }

    return '/group'
  }

  const maybeRedirect: IMaybeRedirect = (
    { location: { pathname } },
    validRoute
  ) => {
    const route = checkState()
    const redirect = Array.isArray(validRoute)
      ? validRoute.includes(route) === false
      : validRoute !== route

    return redirect ? <Redirect to={`${route}`} from={pathname} /> : false
  }

  const RouteMain: IRoute = () => {
    if (active) return null
    const route = checkState()
    switch (route) {
      case '/sign-in':
      case '/create':
        return <Redirect to={`${route}`} from="/" />
      case '/group':
        return <Redirect to={`/group/${pretty(user.group.id)}`} from="/" />
      case '/action':
        return <Redirect to={`/action/${pretty(user.group.action)}`} from="/" />
      case '/wait':
        return <WaitRedirect />
    }
    return <NotFound />
  }

  const RouteSignIn: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, '/sign-in') || <SignIn />
  }

  const RouteCreate: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, '/create') || <CreateOrJoinGroup />
  }

  const RouteLeaveGroup: IRoute = () => {
    if (active) return null
    if (checkState() !== '/group') {
      return <Redirect to="/" />
    }

    const leave = async () => {
      updateActive(true)
      if (!user.group || user.group.id == null) {
        return [updateActive(false), updateRender(true)]
      }

      await api.group.leave(user.group.id)
      user.setValue('group', undefined)
      return [updateActive(false), updateRender(false)]
    }

    leave()

    return <Fragment>{render ? <Redirect to="/" /> : null}</Fragment>
  }

  const RouteGroup = (params: RouteParams) => {
    if (active) return null
    const {
      match: {
        params: { id },
      },
    } = params
    const redirect = maybeRedirect(params, ['/group', '/create'])
    if (redirect) {
      return redirect
    }

    if (user.group != null) {
      if (pretty(user.group.id) !== pretty(id)) {
        return <Redirect to={`/group/${pretty(user.group.id)}`} />
      }

      return <Group />
    }

    const join = async () => {
      updateActive(true)
      const group = await api.group.join(id)
      user.setValue('group', group)
      return [updateRender(true), updateActive(false)]
    }

    join()

    return null
  }

  const RouteGroupWithOutID: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, '/group') || user.group == null ? (
      <Redirect to="/" from="/route" />
    ) : (
      <Redirect to={`${'/group'}/${pretty(user.group.id)}`} from="/group" />
    )
  }

  const RouteActionWithOutID: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, '/action') || user.group == null ? (
      <Redirect to="/" from="/action" />
    ) : (
      <Redirect
        to={`${'/action'}/${pretty(user.group.action)}`}
        from="/action"
      />
    )
  }

  const Wait: IRoute = () => {
    return <WaitRedirect />
  }

  const WaitRedirect: SFC<{}> = () =>
    action.action != null ? (
      <Redirect to={`/action/${pretty(user.group.action)}`} />
    ) : (
      <Fragment />
    )

  const RouteAction: IRoute = params => {
    if (active) return null
    const {
      match: {
        params: { id },
      },
    } = params
    const redirect = maybeRedirect(params, '/action')
    if (redirect) {
      return redirect
    }

    if (user.group != null) {
      if (pretty(user.group.action) !== pretty(id)) {
        return <Redirect to={`/action/${pretty(user.group.action)}`} />
      }

      return <Action />
    }

    const join = async () => {
      updateActive(true)
      const group = await api.group.join(id)
      user.setValue('group', group)
      return [updateRender(true), updateActive(false)]
    }

    join()

    return null
  }

  const NotFound = () => (
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  )

  return (
    <Router>
      <div className="app flex items-center justify-center">
        <Switch>
          <Route path="/" exact component={RouteMain} />
          <Route path="/sign-in" component={RouteSignIn} />
          <Route path="/create" component={RouteCreate} />
          <Route path="/group" exact component={RouteGroupWithOutID} />
          <Route path="/group/leave" exact component={RouteLeaveGroup} />
          <Route path="/group/:id" component={RouteGroup} />
          <Route path="/action" exact component={RouteActionWithOutID} />
          <Route path="/action/:id" component={RouteAction} />
          <Route path="/wait" component={Wait} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
