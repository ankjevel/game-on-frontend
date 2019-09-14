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
          value = input.small + 1
        }

        if (value === input.startSum) {
          return
        }

        break
      }

      case 'startSum': {
        if (value <= input.big) {
          value = input.big * user.group.users.length
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

    await api.group.update(user.group.id, {
      name: name !== user.group.name && name,
      startSum: input.startSum !== user.group.startSum && input.startSum,
      smallBlind: input.small !== user.group.blind.small && input.small,
      bigBlind: input.big !== user.group.blind.big && input.big,
    })
  }

  const startGame = event => {
    event.preventDefault()

    const {
      target: { name, value },
    } = event.target.name

    changeInput({
      ...input,
      [name]: parseInt(value, 10),
    })
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
      <tr
        key={`tr-${id}`}
        className={`p-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap ${even &&
          'bg-gray-100'}`}
      >
        <td className="pl-2 py-2 font-bold">{index}</td>
        <td className="p-2 py-2 pl-0 inline">
          <IconStar
            className={`inline py-2 pb-3 mr-1 -mt-1 -mb-1 inline m-auto h-full hover:text-red-500 fill-current ${isOwner &&
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
          {id === user.id ? <strong>you</strong> : id.replace('user:', '')}
        </td>
        <td>{states.join(', ')}</td>
        {isOwner && (
          <Fragment>
            <td>
              {!end && (
                <IconArrowDown
                  className="cursor-pointer py-2 inline m-auto w-full h-full hover:text-blue-500 fill-current text-gray-500"
                  height={10}
                  onClick={() => changeOrder(index, index + 1)}
                />
              )}
            </td>
            <td>
              {!start && (
                <IconArrowUp
                  className="cursor-pointer py-2 inline m-auto w-full h-full hover:text-blue-500 fill-current text-gray-500"
                  height={10}
                  onClick={() => changeOrder(index, index - 1)}
                />
              )}
            </td>
          </Fragment>
        )}
      </tr>
    )
  }

  return (
    <div className="px-4 py-6">
      <div>
        <div className="w-full text-left p-2 text-gray-700">
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

        <div className="w-full relative">
          <table className="w-full text-left table-collapse mb-5">
            <thead>
              <tr className="text-xs font-semibold text-gray-700 bg-gray-200">
                <th className="p-2">Small blind</th>
                <th className="p-2">Big blind</th>
                <th className="p-2">Start sum</th>
                {isOwner && (
                  <th>
                    {changed && (
                      <button
                        type="button"
                        onClick={updateGroup}
                        className="absolute inline top-0 right-0 mt-2 mr-2 bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-xs leading-none py-1 px-2 rounded"
                      >
                        update
                      </button>
                    )}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="align-baseline">
              <tr className="border-t border-gray-300 font-mono text-xs text-gray-700">
                {isOwner ? (
                  <Fragment>
                    <td className="p-2">
                      <input
                        type="number"
                        onChange={updateStartSums}
                        name="small"
                        value={input.small}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        onChange={updateStartSums}
                        name="big"
                        value={input.big}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        onChange={updateStartSums}
                        name="startSum"
                        value={input.startSum}
                      />
                    </td>
                    <td></td>
                  </Fragment>
                ) : (
                  <Fragment>
                    <td className="p-2">{input.small}</td>
                    <td className="p-2">{input.big}</td>
                    <td className="p-2">{input.startSum}</td>
                  </Fragment>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        <table className="w-full text-left table-collapse">
          <tbody className="align-baseline">
            {users.map(({ id }, i, array) => renderUser(id, i, array.length))}
          </tbody>
        </table>
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
  )
}

export default Group
