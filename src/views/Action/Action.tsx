import { Params } from 'Action'

import React, { memo } from 'react'

import './Action.css'

import BottomBar from '@/components/BottomBar'
import Chip from '@/components/Chip'
import CommunityCards from '@/components/CommunityCards'
import LastMove from '@/components/LastMove'
import PlayerHand from '@/components/PlayerHand'
import SignOut from '@/components/SignOut'
import Users from '@/components/Users'

export const Action = memo(
  ({
    actionID,
    bigID,
    button,
    communityCards,
    group,
    lastMove,
    onClick,
    pot,
    round,
    sidePot = [],
    turn,
    userID,
    users,
    winners = [[]],
  }: Params) => {
    const userTurn = turn[userID]
    const userGroup = group.users.find(user => user.id === userID)
    const big = turn[bigID]

    const chips = big.bet === group.blind.big ? 2 : 3 + sidePot.length
    const sidePots = sidePot
      .filter(({ id }) => id !== bigID)
      .map(({ sum }) => sum)

    return (
      <div className={`c_action round-${round}`} onClick={onClick}>
        <div className="main-top">
          <h1 className="title">{group.name}</h1>
          <SignOut className="sign-out" />
        </div>

        <Users
          className="users"
          bigID={bigID}
          button={button}
          groupUsers={group.users}
          round={round}
          sidePot={sidePot}
          turn={turn}
          userID={userID}
          users={users}
          winners={winners}
        />

        <div className="main">
          <div className={`${sidePots.length ? 'has-side-pots' : ''}`}>
            <div className="table">
              <div className="bets">
                {sidePots.map((sum, i) => (
                  <h1 className="bet side-pot" key={`sidepot-${i}`}>
                    <span className="chips">
                      <Chip className="chip" type="thin" />
                      <Chip className="chip" type="thin" />
                      <Chip className="chip" type="thin" />
                    </span>
                    {sum}
                  </h1>
                ))}
                <h1 className="bet">
                  <span className="chips">
                    {[...Array(chips)].map((_, i) => (
                      <Chip key={`chip-${i}`} className="chip" type="thin" />
                    ))}
                  </span>
                  {big.bet}
                </h1>
                <h3 className="pot key-value">
                  <span>Pot total</span> {pot}
                </h3>
                {round !== 4 && (
                  <LastMove
                    className="last-move key-value"
                    lastMove={lastMove}
                    users={users}
                    you={userID}
                  />
                )}
              </div>
              <div className="holder">
                <CommunityCards
                  className="cards"
                  communityCards={communityCards}
                />
              </div>
              <div className="you">
                <h3 className="bet key-value">
                  <span>Your bet</span> {userTurn.bet}
                </h3>
                <h3 className="bank key-value">
                  <span>Bank</span> {userGroup.sum}
                </h3>
                <PlayerHand
                  className="hand"
                  hand={userTurn.hand}
                  winner={winners[0].includes(userID)}
                />
              </div>
            </div>
          </div>
        </div>

        <BottomBar
          className="bottom"
          actionID={actionID}
          button={button}
          group={group}
          round={round}
          userID={userID}
          users={users}
          userTurn={userTurn}
          userGroup={userGroup}
          big={big}
        />
      </div>
    )
  }
)

export default Action
