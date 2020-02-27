import React, { SFC } from 'react'

import './Introduction.css'

import { Link } from 'react-router-dom'

export const Introduction: SFC<{ title: string }> = ({ title }) => {
  return (
    <div className="c_introduction">
      <header>
        <nav>
          <ol>
            <li className="title">
              <h1>{title}</h1>
            </li>
            <li className="join sign-in">
              <Link to="/sign-in">Sign in</Link>
            </li>
            <li className="join create-new">
              <Link to="/sign-in#new">
                Create <span>a </span>new<span> account</span>
              </Link>
            </li>
          </ol>
        </nav>
      </header>
      <div className="container">
        <div className="hero">
          <h1>Join a POKER game</h1>
          <p>
            Join a open game of poker or start a private game between friends!
            <br />
            The game is regular Texas Hold'em with a fixed small- and big blind.
            <br />
            No limit on max-bet. Play until <i>you</i> win it all!
          </p>
          <p>
            The chat is private per room, and it's not stored on the server.
            <br />
            Please behave.
          </p>
          <Link to="/sign-in#new">Create a new account</Link>
        </div>
      </div>
    </div>
  )
}

export default Introduction
