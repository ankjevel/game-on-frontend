import React, { useContext, useState, useEffect, Fragment } from 'react'

import { Link } from 'react-router-dom'
import userContext from '../../context/User'
import { IconArrowUp, IconArrowDown, IconStar } from 'react-heroicons-ui'
import update from 'immutability-helper'
import api from '../../utils/api'

export const Group = () => {
  const user = useContext(userContext)

  const [users, setOrder] = useState(user.group.users)
  const [owner, setOwner] = useState(user.group.owner)
  const [isOwner, setIsOwner] = useState(owner === user.id)
  const [input, changeInput] = useState({
    small: user.group.blind.small,
    big: user.group.blind.big,
    startSum: user.group.startSum,
  })
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    if (input.small === user.group.blind.small) return
    setChanged(true)
  }, [input.small, user.group.blind.small])

  useEffect(() => {
    if (input.big === user.group.blind.big) return
    setChanged(true)
  }, [input.big, user.group.blind.big])

  useEffect(() => {
    if (input.startSum === user.group.startSum) return
    setChanged(true)
  }, [input.startSum, user.group.startSum])

  useEffect(() => {
    if (owner === user.group.owner) return

    const apply = async () => {
      await api.group.update(user.group.id, { owner })
      console.log('new owner', owner)
    }
    apply()
  }, [owner, user.group.owner])

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
  }, [users, user.group.users])

  const changeOrder = (index: number, newIndex: number) => {
    const user = users[index]
    setOrder(
      update(users, {
        $splice: [[index, 1], [newIndex, 0, user]],
      })
    )
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

  const updateGroup = event => {
    event.preventDefault()
    console.log('save changes')
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
    const small = index === 1
    const big = index === 2 % size

    const states = [start && 'button', small && 'small', big && 'big'].filter(
      x => x
    )

    return (
      <tr
        key={`tr-${id}`}
        className="p-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap"
      >
        <td className="font-bold">{index}</td>
        <td className="p-2">
          <IconStar
            className={`inline -mt-1 ${isOwner && 'cursor-pointer'}`}
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
            fill={id === owner ? 'tomato' : 'gray'}
          />
          {id === user.id ? <strong>you</strong> : id.replace('user:', '')}
        </td>
        <td>{states.join(', ')}</td>
        {isOwner && (
          <Fragment>
            <td>
              {!end && (
                <IconArrowDown
                  className="cursor-pointer"
                  height={15}
                  onClick={() => changeOrder(index, index + 1)}
                />
              )}
            </td>
            <td>
              {!start && (
                <IconArrowUp
                  className="cursor-pointer"
                  height={15}
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
            <h1 className="font-semibold w-full px-2">
              {user.group.name}
              {isOwner && (
                <IconStar className="inline -mt-2" height={10} fill="tomato" />
              )}
            </h1>
          </div>
        </div>

        <div className="w-full relative">
          <table className="w-full text-left table-collapse">
            <thead>
              <tr className="text-xs font-semibold text-gray-700 bg-gray-100">
                <th className="p-2">Small blind</th>
                <th className="p-2">Big blind</th>
                <th className="p-2">Start sum</th>
                {isOwner && (
                  <th>
                    <button
                      type="button"
                      onClick={updateGroup}
                      className="absolute inline top-0 right-0 mt-2 mr-2 bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-xs leading-none py-1 px-2 rounded"
                    >
                      update
                    </button>
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
          <thead className="text-xs font-semibold text-gray-700 bg-gray-100">
            <tr>
              <th></th>
              <th className="p-2">order</th>
              <th></th>
              {isOwner && (
                <Fragment>
                  <th></th>
                  <th></th>
                </Fragment>
              )}
            </tr>
          </thead>
          <tbody className="align-baseline">
            {users.map(({ id }, i, array) => renderUser(id, i, array.length))}
          </tbody>
        </table>
      </div>

      <div className="pt-4">
        <Link
          className="inline-block leave-button bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white text-base leading-none py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          to="/group/leave"
        >
          Leave group
        </Link>
        {owner && (
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
