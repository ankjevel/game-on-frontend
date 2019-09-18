import React, { useContext, useState, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { RouteParams, IMaybeRedirect, ERoute, IRoute } from '../../types/Route'
import userContext from '../../context/User'
import Action from '../Action'
import CreateOrJoinGroup from '../CreateOrJoinGroup'
import Group from '../Group'
import SignIn from '../SignIn'
import api from '../../utils/api'

export const App = () => {
  const user = useContext(userContext)
  const [render, updateRender] = useState(false)
  const [active, updateActive] = useState(false)

  const checkState = (): ERoute => {
    if (user.id === '') {
      return '/sign-in'
    }

    if (user.group == null) {
      return '/create'
    }

    if (user.group.action != null) {
      return '/action'
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
        return (
          <Redirect
            to={`/group/${user.group.id.replace(/group:/, '')}`}
            from="/"
          />
        )
      case '/action':
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
      if (user.group.id !== (id.startsWith('group:') ? id : `group:${id}`)) {
        return <Redirect to={`/group/${user.group.id}`} />
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
      <Redirect
        to={`${'/group'}/${user.group.id.replace('group:', '')}`}
        from="/group"
      />
    )
  }

  const RouteActionWithOutID: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, '/action') || user.group == null ? (
      <Redirect to="/" from="/action" />
    ) : (
      <Redirect
        to={`${'/action'}/${user.group.action.replace('action:', '')}`}
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
    const redirect = maybeRedirect(params, '/action')
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
