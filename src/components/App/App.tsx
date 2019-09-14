import React, { useContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import userContext from '../../context/User'
import CreateOrJoinGroup from '../CreateOrJoinGroup'
import Group from '../Group'
import SignIn from '../SignIn'

enum ERoute {
  None = '/',
  SignIn = '/sign-in',
  CreateOrJoin = '/create',
  Group = '/group',
}

type RouteParamsLocation = {
  pathname: string
  search: string
  hash: string
  key: string
}

type RouteParams = {
  history: {
    length: number
    action: string
    location: RouteParamsLocation
  }
  location: RouteParamsLocation
  match: {
    path: string
    url: string
    isExact: boolean
    params: { [key: string]: string }
  }
}

interface IRoute {
  (params?: RouteParams): JSX.Element
}

interface IMaybeRedirect {
  (props: RouteParams, currentRoute: ERoute): JSX.Element | false
}

export const App = () => {
  const user = useContext(userContext)

  const checkState = () => {
    if (user.id === '') {
      return ERoute.SignIn
    }
    if (user.group == null) {
      return ERoute.CreateOrJoin
    }
    return ERoute.Group
  }

  const maybeRedirect: IMaybeRedirect = (
    { location: { pathname } },
    currentRoute
  ) => {
    const route = checkState()
    return route !== currentRoute ? (
      <Redirect to={`${route}`} from={pathname} />
    ) : (
      false
    )
  }

  const RouteMain: IRoute = () => {
    const route = checkState()
    switch (route) {
      case ERoute.SignIn:
      case ERoute.CreateOrJoin:
        console.log('routeMain', route)
        return <Redirect to={`${route}`} from="/" />
      case ERoute.Group:
        return (
          <Redirect
            to={`/group/${user.group.id.replace(/group:/, '')}`}
            from="/"
          />
        )
    }
    return <NotFound />
  }

  const RouteSignIn: IRoute = params => {
    return maybeRedirect(params, ERoute.SignIn) || <SignIn />
  }

  const RouteCreate: IRoute = params => {
    return maybeRedirect(params, ERoute.CreateOrJoin) || <CreateOrJoinGroup />
  }

  const RouteGroup: IRoute = params => {
    return maybeRedirect(params, ERoute.Group) || user.group == null ? (
      <Redirect to="/" from="/route" />
    ) : (
      <Group />
    )
  }

  const RouteGroupWithOutID: IRoute = params => {
    return maybeRedirect(params, ERoute.Group) || user.group == null ? (
      <Redirect to="/" from="/route" />
    ) : (
      <Redirect
        to={`/group/${user.group.id.replace(/group:/, '')}`}
        from={params.history.location.pathname}
      />
    )
  }

  const NotFound = () => (
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  )

  return (
    <Router>
      <div className="app flex items-center justify-center">
        <div className="self-center auto l-w-1/2 s-w-full m-w-full rounded overflow-hidden shadow-lg bg-white">
          <Switch>
            <Route path="/" exact component={RouteMain} />
            <Route path="/sign-in" component={RouteSignIn} />
            <Route path="/create" component={RouteCreate} />
            <Route path="/group" exact component={RouteGroupWithOutID} />
            <Route path="/group/:id" component={RouteGroup} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App
