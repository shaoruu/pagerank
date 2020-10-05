import React, { useEffect, useState } from 'react'
import Node from '../components/Node'
import './App.scss'
import graph from 'pagerank.js'
import { notification, Input, Button, Table } from 'fiber-ui'

const getMidRandom = (n) => ((Math.random() - 0.5) * n + 50) / 100

const defaultNodes = [1, 2, 3, 4, 5, 6, 7]
const defaultLocations = [
  {
    x: getMidRandom(70) * window.innerWidth,
    y: getMidRandom(40) * window.innerHeight
  },
  {
    x: getMidRandom(70) * window.innerWidth,
    y: getMidRandom(40) * window.innerHeight
  },
  {
    x: getMidRandom(70) * window.innerWidth,
    y: getMidRandom(40) * window.innerHeight
  },
  {
    x: getMidRandom(70) * window.innerWidth,
    y: getMidRandom(40) * window.innerHeight
  },
  {
    x: getMidRandom(70) * window.innerWidth,
    y: getMidRandom(40) * window.innerHeight
  },
  {
    x: getMidRandom(70) * window.innerWidth,
    y: getMidRandom(40) * window.innerHeight
  },
  {
    x: getMidRandom(70) * window.innerWidth,
    y: getMidRandom(40) * window.innerHeight
  }
]
const defaultConnections = [
  [1, 2],
  [1, 7],
  [2, 3],
  [2, 5],
  [4, 5],
  [4, 6],
  [6, 7]
]

const columns = [
  { title: 'ID (#)', dataIndex: 'id', key: 'id' },
  { title: 'Score', dataIndex: 'score', key: 'score' }
]

function App() {
  const [connections, setConnections] = useState(defaultConnections)
  const [nodes, setNodes] = useState(defaultNodes)
  const [locations, setLocations] = useState(defaultLocations)

  const [hover, setHover] = useState(null)
  const [start, setStart] = useState(1)
  const [end, setEnd] = useState(3)

  graph.reset()

  connections.forEach(([a, b]) => {
    graph.link(a, b)
  })

  const ranks = []
  graph.rank(0.81, 0.000001, (node, rank) => {
    ranks[node - 1] = rank.toFixed(3)
  })

  const onFormSubmit = () => {
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      notification.open({
        message: 'Invalid page numbers!',
        placement: 'topRight',
        duration: 1,
        closeIcon: false,
        style: {
          background: '#ff4444'
        }
      })
    } else if (
      start === end ||
      start > nodes.length ||
      start < 0 ||
      end > nodes.length ||
      end < 0
    )
      notification.open({
        message: "Pages don't work!",
        placement: 'topRight',
        duration: 1,
        closeIcon: false,
        style: {
          background: '#ff4444'
        }
      })
    else {
      if (
        !connections.filter(
          (c) => JSON.stringify(c) === JSON.stringify([start, end])
        ).length
      ) {
        notification.open({
          message: `Linking page ${start} to page ${end}...`,
          placement: 'topRight',
          duration: 2,
          closeIcon: false,
          style: {
            background: '#03c4a1'
          }
        })
        setConnections(() => [...connections, [start, end]])
      } else {
        notification.open({
          message: `Link from page ${start} to page ${end} already exists.`,
          placement: 'topRight',
          duration: 2,
          closeIcon: false,
          style: {
            background: '#f0a500'
          }
        })
      }
    }
  }

  const onAddNewNode = () => {
    setNodes(() => [...nodes, nodes.length + 1])
    setLocations(() => [
      ...locations,
      {
        x: getMidRandom(70) * window.innerWidth,
        y: getMidRandom(40) * window.innerHeight
      }
    ])
  }

  console.log(ranks)

  const findConnections = (n) => {
    return connections.filter(([a]) => a === n).map(([_, b]) => b)
  }

  const data = ranks
    .map((r, i) => ({ id: i + 1, score: r }))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="app-wrapper">
      <div className="page-ranks">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ hideOnSinglePage: true }}
        />
      </div>
      <div className="visual-main">
        {nodes.map((n, i) => (
          <Node
            key={i}
            id={n}
            connections={findConnections(n)}
            value={ranks[i]}
            position={locations[i]}
            hover={hover}
            setHover={setHover}
          />
        ))}
      </div>
      <div className="connection-form">
        Link{' '}
        <Input
          value={start}
          onChange={(e) => setStart(parseInt(e.target.value, 10) || 0)}
        />{' '}
        to{' '}
        <Input
          value={end}
          onChange={(e) => setEnd(parseInt(e.target.value, 10) || 0)}
        />{' '}
        <Button onClick={onFormSubmit}>Go!</Button>
      </div>
      <div className="add-form">
        <Button onClick={onAddNewNode}>Add New Node</Button>
      </div>
    </div>
  )
}

export default App
