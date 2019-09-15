import React, { useContext, useState, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { RouteParams, IMaybeRedirect, ERoute, IRoute } from '../../types/Route'
import userContext, { SetValue } from '../../context/User'
import Action from '../Action'
import CreateOrJoinGroup from '../CreateOrJoinGroup'
import Group from '../Group'
import SignIn from '../SignIn'
import api from '../../utils/api'

export const App = () => {
  const user = useContext(userContext)
  const [render, updateRender] = useState(false)
  const [active, updateActive] = useState(false)

  const checkState = () => {
    if (user.id === '') {
      return ERoute.SignIn
    }

    if (user.group == null) {
      return ERoute.CreateOrJoin
    }

    if (user.group.action != null) {
      return ERoute.Action
    }

    return ERoute.Group
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
      case ERoute.SignIn:
      case ERoute.CreateOrJoin:
        return <Redirect to={`${route}`} from="/" />
      case ERoute.Group:
        return (
          <Redirect
            to={`/group/${user.group.id.replace(/group:/, '')}`}
            from="/"
          />
        )
      case ERoute.Action:
        return (
          <Redirect
            to={`/action/${user.group.action.replace(/action:/, '')}`}
            from="/"
          />
        )
    }
    return <NotFound />
  }

  const RouteSignIn: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, ERoute.SignIn) || <SignIn />
  }

  const RouteCreate: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, ERoute.CreateOrJoin) || <CreateOrJoinGroup />
  }

  const RouteLeaveGroup: IRoute = () => {
    if (active) return null
    if (checkState() !== ERoute.Group) {
      return <Redirect to="/" />
    }

    const leave = async () => {
      updateActive(true)
      if (!user.group || user.group.id == null) {
        return [updateActive(false), updateRender(true)]
      }

      await api.group.leave(user.group.id)
      user.setValue(SetValue.Group, undefined)
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
    const redirect = maybeRedirect(params, [ERoute.Group, ERoute.CreateOrJoin])
    if (redirect) {
      return redirect
    }

    if (user.group != null) {
      if (user.group.id !== (id.startsWith('group:') ? id : `group:${id}`)) {
        return <Redirect to={`/group/${user.group.id}`} />
      }

      return <Group />
    }

    const join = async () => {
      updateActive(true)
      const group = await api.group.join(id)
      user.setValue(SetValue.Group, group)
      return [updateRender(true), updateActive(false)]
    }

    join()

    return null
  }

  const RouteGroupWithOutID: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, ERoute.Group) || user.group == null ? (
      <Redirect to="/" from="/route" />
    ) : (
      <Redirect
        to={`${ERoute.Group}/${user.group.id.replace('group:', '')}`}
        from="/group"
      />
    )
  }

  const RouteActionWithOutID: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, ERoute.Action) || user.group == null ? (
      <Redirect to="/" from="/action" />
    ) : (
      <Redirect
        to={`${ERoute.Action}/${user.group.action.replace('action:', '')}`}
        from="/action"
      />
    )
  }

  const RouteAction: IRoute = params => {
    if (active) return null
    const {
      match: {
        params: { id },
      },
    } = params
    const redirect = maybeRedirect(params, ERoute.Action)
    if (redirect) {
      return redirect
    }

    if (user.group != null) {
      if (
        user.group.action !== (id.startsWith('action:') ? id : `action:${id}`)
      ) {
        return <Redirect to={`/action/${user.group.action}`} />
      }

      return <Action />
    }

    const join = async () => {
      updateActive(true)
      const group = await api.group.join(id)
      user.setValue(SetValue.Group, group)
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
        <div className="self-center auto w-full sm:w-full md:w-2/3 lg:w-2/3 xl:w-1/2 rounded overflow-hidden shadow-lg bg-white">
          <Switch>
            <Route path="/" exact component={RouteMain} />
            <Route path="/sign-in" component={RouteSignIn} />
            <Route path="/create" component={RouteCreate} />
            <Route path="/group" exact component={RouteGroupWithOutID} />
            <Route path="/group/leave" exact component={RouteLeaveGroup} />
            <Route path="/group/:id" component={RouteGroup} />
            <Route path="/action" exact component={RouteActionWithOutID} />
            <Route path="/action/:id" component={RouteAction} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App
