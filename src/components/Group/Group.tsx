import React, { useContext, useState, useEffect, Fragment } from 'react'

import { Link } from 'react-router-dom'
import userContext from '../../context/User'
import { IconArrowUp, IconArrowDown, IconStar } from 'react-heroicons-ui'
import update from 'immutability-helper'
import api from '../../utils/api'

export const Group = () => {
  const user = useContext(userContext)

  const [owner, setOwner] = useState(user.group.owner)
  const [users, setOrder] = useState(user.group.users)
  const [name, changeName] = useState(user.group.name)
  const [changed, setChanged] = useState(false)
  const [isOwner, setIsOwner] = useState(owner === user.id)
  const [usersObject] = useState(user.users)
  const [input, changeInput] = useState({
    small: user.group.blind.small,
    big: user.group.blind.big,
    startSum: user.group.startSum,
  })

  useEffect(() => {
    setChanged(
      input.small !== user.group.blind.small ||
        input.big !== user.group.blind.big ||
        input.startSum !== user.group.startSum ||
        name !== user.group.name
    )
  }, [
    input.big,
    input.small,
    input.startSum,
    name,
    user.group.blind.big,
    user.group.blind.small,
    user.group.name,
    user.group.startSum,
  ])

  useEffect(() => {
    if (owner === user.group.owner) return
    const apply = async () => {
      await api.group.update(user.group.id, { owner })
    }
    apply()
  }, [owner, user.group.owner, user.group.id])

  useEffect(() => {
    if (
      JSON.stringify(users.map(({ id }) => id)) ===
      JSON.stringify(user.group.users.map(({ id }) => id))
    ) {
      return
    }
    const apply = async () => {
      await api.group.order(
        user.group.id,
        users.reduce((object, { id }, index) => {
          object[index] = id
          return object
        }, {})
      )
    }
    apply()
  }, [users, user.group.users, user.group.id])

  const changeOrder = (index: number, newIndex: number) => {
    const user = users[index]
    setOrder(
      update(users, {
        $splice: [[index, 1], [newIndex, 0, user]],
      })
    )
  }

  const updateName = event => {
    event.preventDefault()

    const {
      target: { value: preFormatted },
    } = event

    const value = preFormatted
      .trimLeft()
      .replace(/ {1,}$/, '-')
      .replace(/[^a-z0-9-åäö]/gi, '')
      .replace(/-{2,}/g, '-')
      .toLocaleLowerCase()
      .substr(0, 64)

    changeName(value)
  }

  const updateStartSums = event => {
    event.preventDefault()

    const {
      target: { name, value: preFormatted },
    } = event

    let value = isNaN(parseInt(preFormatted, 10))
      ? 0
      : parseInt(preFormatted, 10)

    switch (name) {
      case 'big': {
        if (value >= input.startSum || value <= input.small) {
          value = input.small * 2
        }

        if (value === input.startSum) {
          return
        }

        break
      }

      case 'startSum': {
        if (value <= input.big) {
          value = input.big * (user.group.users.length * 2)
        }

        break
      }

      case 'small': {
        if (value >= input.big) {
          value = input.small - 1
        }

        if (value < 1) {
          return
        }

        break
      }

      default:
        return
    }

    changeInput({
      ...input,
      [name]: value,
    })
  }

  const updateGroup = async event => {
    event.preventDefault()

    const update: [string, string | number | boolean][] = [
      ['name', name !== user.group.name && name.length > 3 && name],
      ['startSum', input.startSum !== user.group.startSum && input.startSum],
      ['smallBlind', input.small !== user.group.blind.small && input.small],
      ['bigBlind', input.big !== user.group.blind.big && input.big],
    ]

    await api.group.update(
      user.group.id,
      update
        .filter(([, value]) => value !== false)
        .reduce((object, [key, value]) => {
          object[key] = value
          return object
        }, {})
    )
  }

  const startGame = async event => {
    event.preventDefault()

    await api.group.start(user.group.id)
  }

  const renderUser = (id: string, index: number, size: number) => {
    const start = index == 0
    const end = index === size - 1
    const small = index === 1 % size
    const big = index === 2 % size

    const states = [start && 'button', small && 'small', big && 'big'].filter(
      x => x
    )

    const even = index % 2 === 0
    return (
      <div
        key={`div-${id}`}
        className={`w-full flex flex-row pl-2 pr-2 pt-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap ${even &&
          'bg-gray-100'}`}
      >
        <div className="pl-2 font-bold flex-grow-0 flex-shrink-0">
          <span className="inline-block align-bottom w-full h-full">
            {index}
          </span>
        </div>
        <div className="pl-2 flex-grow-0 flex-shrink-0">
          <IconStar
            className={`m-auto h-full pb-3 pt-1 hover:text-red-500 fill-current ${isOwner &&
              'cursor-pointer'} ${
              id === owner ? 'text-red-500' : 'text-gray-400'
            }`}
            height={10}
            onClick={() => {
              if (
                isOwner &&
                window.confirm('are you sure you wish to swich owner?')
              ) {
                setOwner(id)
                setIsOwner(id === user.id)
              }
            }}
          />
        </div>
        <div className="flex-grow-1 w-full">
          <span className="inline-block align-bottom w-full h-full">
            {id === user.id ? (
              <strong>you</strong>
            ) : (
              usersObject[id] || id.replace('user:', '')
            )}
          </span>
        </div>
        <div className="flex-grow-1">
          <span className="inline-block align-bottom w-full h-full">
            {states.join(', ')}
          </span>
        </div>
        {isOwner && (
          <Fragment>
            <div className="w-8 h-5 flex-grow-0 flex-shrink-0">
              {!end && (
                <IconArrowDown
                  className="cursor-pointer inline ml-2 w-6 h-5 hover:text-blue-500 fill-current text-gray-500"
                  height={5}
                  onClick={() => changeOrder(index, index + 1)}
                />
              )}
            </div>
            <div className="w-8 h-5 flex-grow-0 flex-shrink-0">
              {!start && (
                <IconArrowUp
                  className="cursor-pointer inline ml-2 w-6 h-5 hover:text-blue-500 fill-current text-gray-500"
                  height={5}
                  onClick={() => changeOrder(index, index - 1)}
                />
              )}
            </div>
          </Fragment>
        )}
      </div>
    )
  }

  return (
    <div className="self-center auto w-full sm:w-full md:w-2/3 lg:w-2/3 xl:w-1/2 rounded overflow-hidden shadow-lg bg-white">
      <div className="px-4 py-6">
        <div>
          <div className="w-full text-left p-2 text-gray-700 flex flex-col">
            <div className="flex -mx-2">
              {isOwner ? (
                <span className="font-semibold flex w-full px-2">
                  <IconStar
                    className="inline-block mt-1 fill-current text-red-500"
                    height={10}
                  />
                  <input
                    className="font-semibold inline-block w-full"
                    value={name}
                    onChange={updateName}
                  />
                </span>
              ) : (
                <h1 className="font-semibold w-full px-2">{name}</h1>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col text-xs font-semibold text-gray-700 bg-gray-200 relative">
            <div className="w-full flex flex-row">
              <div className="p-2 w-full">
                <h2>Small blind</h2>
              </div>
              <div className="p-2 w-full">
                <h2>Big blind</h2>
              </div>
              <div className="p-2 w-full">
                <h2>Start sum</h2>
              </div>
              {isOwner && changed && (
                <button
                  type="button"
                  onClick={updateGroup}
                  className="absolute inline top-0 right-0 mt-2 mr-2 bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-xs leading-none py-1 px-2 rounded"
                >
                  update
                </button>
              )}
            </div>

            <div className="w-full align-baseline flex flex-row border-t border-gray-300 font-mono text-xs text-gray-700 bg-white">
              {isOwner ? (
                <Fragment>
                  <div className="p-2 w-full">
                    <input
                      type="number"
                      onChange={updateStartSums}
                      name="small"
                      value={input.small}
                    />
                  </div>
                  <div className="p-2 w-full">
                    <input
                      type="number"
                      onChange={updateStartSums}
                      name="big"
                      value={input.big}
                    />
                  </div>
                  <div className="p-2 w-full">
                    <input
                      type="number"
                      onChange={updateStartSums}
                      name="startSum"
                      value={input.startSum}
                    />
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className="p-2 w-full">{input.small}</div>
                  <div className="p-2 w-full">{input.big}</div>
                  <div className="p-2 w-full">{input.startSum}</div>
                </Fragment>
              )}
            </div>
          </div>

          <div className="w-full mt-10 text-left align-baseline flex flex-col">
            {users.map(({ id }, i, array) => renderUser(id, i, array.length))}
          </div>
        </div>

        <div className="pt-4 mt-4">
          <Link
            className="inline-block leave-button bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white text-base leading-none py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            to="/group/leave"
          >
            Leave group
          </Link>
          {isOwner && (
            <button
              type="button"
              onClick={startGame}
              className="inline-block float-right bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
            >
              Start game
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Group
