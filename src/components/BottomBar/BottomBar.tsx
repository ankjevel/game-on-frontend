import CAction, { NewAction, UserSummary } from 'CAction'
import CUser from 'CUser'
import React, { memo, useState } from 'react'

import './BottomBar.css'

import Slider from 'rc-slider'

import api from '@/utils/api'
import PlayerCards from '@/components/PlayerCards'
import { User } from 'Api'

export const BottomBar = memo(
  ({
    className: cn = '',
    actionID,
    button,
    group,
    round,
    userID,
    users,
    userTurn,
    userGroup,
    big,
  }: {
    className?: string
    actionID: CAction['id']
    button: CAction['button']
    group: CUser['group']
    round: CAction['round']
    userID: CUser['id']
    users: CUser['users']
    userTurn: UserSummary
    userGroup: {
      id: User['id']
      sum: number
    }
    big: UserSummary
  }) => {
    const [callPending, setCallPending] = useState(false)
    const currentButton = button === userID ? 'You' : users[button]
    const [input, setInput] = useState({
      raise: Math.min(2, Math.max(userTurn.bet, 1)),
      raiseDirty: false,
    })

    const req = async (body: NewAction) => {
      setCallPending(true)
      await api.action.newAction(actionID, group.id, body)
      setCallPending(false)
    }

    const actions = {
      async check() {
        await req({
          type:
            round === 0 && big.bet === group.blind.big
              ? 'bet'
              : big.bet === userTurn.bet
              ? 'check'
              : 'call',
        })
      },
      async raise(value: number) {
        console.log({ raise: value })

        await req({ type: 'raise', value })
      },
      async fold() {
        await req({ type: 'fold' })
      },
      async allIn() {
        await req({ type: 'allIn' })
      },
      async confirm() {
        await req({ type: 'confirm' })
      },
    }

    const raiseBet = async () => {
      console.log('raiseBet')
      if (callPending || input.raiseDirty || input.raise <= 0) {
        console.log('0')
        return
      }

      if (input.raise >= userGroup.sum) {
        console.log('1')
        window.alert('maybe go all in?')
        return
      }

      console.log('2')
      await actions.raise(input.raise)
    }

    const betMax = userGroup.sum - (big.bet - userTurn.bet)

    const className = [
      'c_bottom-bar',
      button === userID ? 'turn' : '',
      round === 4 ? 'showdown' : '',
      cn,
    ]
      .filter(c => c)
      .join(' ')

    return (
      <div className={className}>
        <PlayerCards className="player-cards" cards={userTurn.cards} />
        {round === 4 && userTurn.status !== 'confirm' && (
          <div className="confirm">
            <button
              type="button"
              onClick={() => actions.confirm()}
              disabled={callPending}
              className="button"
            >
              Start new round
            </button>
          </div>
        )}

        <div className={`holder${betMax <= 0 ? ' only-all-in' : ''}`}>
          <div className="current-button">
            <h3>
              <span>Waiting for</span>
              <span className="name">{currentButton}</span>
              <span>To make a move</span>
            </h3>
          </div>
          <button
            onClick={() => !callPending && actions.check()}
            disabled={callPending}
            type="button"
            className={`button button-bet-call${
              callPending ? ' disabled' : ''
            }`.trim()}
          >
            {round === 0 && big.bet === group.blind.big
              ? 'bet'
              : big.bet === userTurn.bet
              ? 'check'
              : 'call'}
          </button>
          <button
            type="button"
            disabled={callPending}
            onClick={() => !callPending && actions.fold()}
            className={`button button-fold${
              callPending ? ' disabled' : ''
            }`.trim()}
          >
            fold
          </button>
          <button
            type="button"
            disabled={callPending || input.raiseDirty}
            onClick={async event => {
              event.preventDefault()
              await raiseBet()
            }}
            className={`button button-raise${
              callPending || input.raiseDirty ? ' disabled' : ''
            }${betMax <= 0 || input.raise >= betMax ? ' hidden' : ''}`.trim()}
          >
            raise
          </button>
          <button
            type="button"
            disabled={callPending || input.raiseDirty || input.raise < betMax}
            onClick={() => !callPending && actions.allIn()}
            className={`button button-all-in ${
              input.raise < betMax ? 'hidden' : ''
            }${
              callPending || input.raiseDirty || input.raise < betMax
                ? ' disabled'
                : ''
            }`.trim()}
          >
            all-in
          </button>
          <div className="raise">
            <strong>Raise:</strong>
            <input
              value={input.raise}
              type="number"
              max={betMax}
              onKeyUp={event => {
                if (event.keyCode === 13 || event.charCode === 13) {
                  event.preventDefault()
                  raiseBet()
                  return
                }
              }}
              onChange={event => {
                event.preventDefault()
                const {
                  target: { valueAsNumber: raise },
                } = event

                if (isNaN(raise)) {
                  return setInput({
                    ...input,
                    raiseDirty: true,
                    raise: '' as any,
                  })
                }

                setInput({
                  ...input,
                  raiseDirty: raise > betMax || raise <= 0,
                  raise,
                })
              }}
            />
          </div>
          <Slider
            className="slider"
            value={input.raise}
            onChange={raise => {
              setInput({
                ...input,
                raiseDirty: raise > betMax || raise <= 0,
                raise,
              })
            }}
            max={betMax}
          />
        </div>
      </div>
    )
  }
)

export default BottomBar
