import { RouteParams, IMaybeRedirect, ERoute, IRoute } from 'Route'

import React, {
  Fragment,
  lazy,
  memo,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react'

import './App.css'

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  Prompt,
} from 'react-router-dom'
import { IconComment } from 'react-heroicons-ui'

import Action from '@/views/Action'
import SignIn from '@/views/SignIn'
import CreateOrJoinGroup from '@/views/CreateOrJoinGroup'
import Group from '@/views/Group'
import Introduction from '@/views/Introduction'
import Chat from '@/components/Chat'
import api from '@/utils/api'
import actionContext from '@/context/Action'
import chatContext from '@/context/Chat'
import userContext from '@/context/User'
import { onMessage } from '@/context/Socket'
import configContext from '@/context/Config'

export const App = () => {
  const config = useContext(configContext)
  const user = useContext(userContext)
  const action = useContext(actionContext)
  const chat = useContext(chatContext)

  useEffect(() => {
    const newState = `state-${chat.visible ? 'visible' : 'hidden'}`

    if (newState === chatVisibility) {
      return
    }

    updateChatVisibility(newState)
  }, [user.id, chat.visible])

  useEffect(() => {
    if (chat.messages.length === 0) {
      return
    }

    const newState = chat.visible ? '' : 'new-message'
    const last = chat.messages[chat.messages.length - 1][0]

    if (newState === messageState) {
      if (last !== lastMessage) {
        updateLastMessage(last)
      }
      return
    }

    if (newState !== '' && last === lastMessage) {
      return
    }

    updateLastMessage(last)
    updateMessageState(newState)
  }, [[chat.visible, chat.messages.length]])

  const [render, updateRender] = useState(false)
  const [active, updateActive] = useState(false)
  const [chatVisibility, updateChatVisibility] = useState('')
  const [messageState, updateMessageState] = useState('')
  const [lastMessage, updateLastMessage] = useState('')

  const pretty = (key: string) => {
    return key.replace(/^.+?:/, '')
  }

  const checkState = (params): ERoute => {
    if (user.id === '') {
      if (params.match.path === '/') {
        return '/'
      }
      return '/sign-in'
    }

    if (user.group == null) {
      return '/create'
    }

    if (user.group.action != null && action.id == null) {
      return '/wait'
    }

    if (
      user.group.action != null &&
      action.id != null &&
      user.group.action === action.id
    ) {
      return '/game'
    }

    if (user.group.users.find(({ id }) => id === user.id) == null) {
      return '/create'
    }

    return '/group'
  }

  const maybeRedirect: IMaybeRedirect = (params, validRoute) => {
    const {
      location: { pathname },
    } = params
    const route = checkState(params)
    const redirect = Array.isArray(validRoute)
      ? validRoute.includes(route) === false
      : validRoute !== route

    return redirect ? <Redirect to={`${route}`} from={pathname} /> : false
  }

  const RouteMain: IRoute = params => {
    if (active) return null
    const route = checkState(params)
    switch (route) {
      case '/':
        return <Introduction title={config.title} />
      case '/sign-in':
      case '/create':
        return <Redirect to={`${route}`} from="/" />
      case '/group':
        return <Redirect to={`/group/${pretty(user.group.id)}`} from="/" />
      case '/game':
        return <Redirect to={`/game/${pretty(user.group.action)}`} from="/" />
      case '/wait':
        return <WaitRedirect to="/" waitFor={action.id} toNotBe={null} />
    }
    return <NotFound />
  }

  const RouteSignIn: IRoute = params => {
    if (active) return null
    return (
      maybeRedirect(params, '/sign-in') || (
        <SignIn createNew={params.location.hash.toLowerCase() === '#new'} />
      )
    )
  }

  const RouteCreate: IRoute = params => {
    if (active) return null
    return maybeRedirect(params, '/create') || <CreateOrJoinGroup />
  }

  const RouteLeaveGroup: IRoute = params => {
    if (active) return null
    if (checkState(params) !== '/group') return <Redirect to="/" />

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

      return (
        <Group onClick={() => chat.visible && chat.updateVisibility(false)} />
      )
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
    return maybeRedirect(params, '/game') || user.group == null ? (
      <Redirect to="/" from="/game" />
    ) : (
      <Redirect to={`${'/game'}/${pretty(user.group.action)}`} from="/game" />
    )
  }

  const Wait: IRoute = () => (
    <WaitRedirect
      to={`/game/${pretty(user.group.action)}`}
      waitFor={action.id}
      toNotBe={null}
    />
  )

  const toCheck = (array: [boolean, boolean, any][]) =>
    array.find(([, , x]) => x !== undefined)

  const checkValue = (
    isStrict: boolean,
    isNot: boolean,
    value: any,
    waitFor: any
  ) =>
    isStrict
      ? isNot
        ? waitFor !== value
        : waitFor === value
      : isNot
      ? waitFor != value
      : waitFor == value

  const WaitRedirect = memo(
    ({
      to,
      waitFor,
      toBe,
      toBeEql,
      toNotBe,
      toNotBeEql,
    }: {
      to: string
      waitFor?: any
      toBe?: any
      toBeEql?: any
      toNotBe?: any
      toNotBeEql?: any
    }) => {
      const res = checkValue.apply(this, [
        ...toCheck([
          [true, false, toBeEql],
          [true, true, toNotBeEql],
          [false, false, toBe],
          [false, true, toNotBe],
        ]),
        waitFor,
      ])
      return res ? <Redirect to={to} /> : <Fragment />
    }
  )

  const RouteAction: IRoute = params => {
    if (active) return null
    const {
      match: {
        params: { id },
      },
    } = params
    const redirect = maybeRedirect(params, '/game')
    if (redirect) {
      return redirect
    }

    if (user.group != null) {
      if (pretty(user.group.action) !== pretty(id)) {
        return <Redirect to={`/game/${pretty(user.group.action)}`} />
      }

      return (
        <Action
          onClick={() => chat.visible && chat.updateVisibility(false)}
          turn={action.turn}
          communityCards={action.communityCards}
          round={action.round}
          pot={action.pot}
          button={action.button}
          actionID={action.id}
          bigID={action.big}
          userID={user.id}
          group={user.group}
          users={user.users}
          winners={action.winners}
          sidePot={action.sidePot}
          lastMove={action.lastMove}
        />
      )
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

  const SignOut: IRoute = () => {
    if (user.id == '') {
      return <Redirect to="/" />
    }

    const WhenDone = lazy(async () => {
      await user.setValue('reset', '')
      await chat.reset()

      return {
        default: () => null,
      }
    })

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <WhenDone />
      </Suspense>
    )
  }

  const NotFound = () => <div>NONE NON NOEN</div>

  return (
    <Router>
      <div className="c_app">
        <Prompt
          message={location =>
            location.pathname.includes('sign-out')
              ? `Are you sure you want to sign out?`
              : true
          }
        />

        <Switch>
          <Route path="/" exact component={RouteMain} />
          <Route path="/create" component={RouteCreate} />
          <Route path="/game" exact component={RouteActionWithOutID} />
          <Route path="/game/:id" component={RouteAction} />
          <Route path="/group" exact component={RouteGroupWithOutID} />
          <Route path="/group/leave" exact component={RouteLeaveGroup} />
          <Route path="/group/:id" component={RouteGroup} />
          <Route path="/sign-in" component={RouteSignIn} />
          <Route path="/sign-out" component={SignOut} />
          <Route path="/wait" component={Wait} />
        </Switch>

        {user.id !== '' && user.group != null && (
          <Fragment>
            <Chat
              className={`chat ${chatVisibility} ${messageState}`.trim()}
              onMessage={onMessage}
              messages={chat.messages}
              users={user.users}
              userID={user.id}
            />

            <button
              type="button"
              className={`chat-toggle ${chatVisibility} ${messageState}`.trim()}
              onClick={() => chat.updateVisibility(!chat.visible)}
            >
              <IconComment />
            </button>
          </Fragment>
        )}
      </div>
    </Router>
  )
}

export default App
