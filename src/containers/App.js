import React, { useState } from 'react'
import Node from '../components/Node'
import './App.scss'
import graph from 'pagerank.js'
import { notification, Input, Button, Table } from 'fiber-ui'

const getMidRandom = (n) => ((Math.random() - 0.5) * n + 50) / 100

const defaultNodes = [0, 1, 2, 3, 4, 5]
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
]
const defaultConnections = [
  [0, 1],
  [1, 2],
  [1, 3],
  [1, 3],
  [1, 4],
  [1, 5],
  [2, 0],
  [2, 4],
  [3, 0],
  [3, 5],
  [5, 2]
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

  const visited = new Set()
  connections.forEach(([a, b]) => {
    graph.link(a, b)

    visited.add(a)
    visited.add(b)
  })

  const leftover = nodes.filter(n => !visited.has(n))
  leftover.forEach(l => graph.link(l, l))

  const ranks = []
  graph.rank(0.81, 0.000001, (node, rank) => {
    ranks[node] = rank.toFixed(3)
  })

  const onFormSubmit = () => {
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      notification.open({
        message: 'Invalid page numbers!',
        placement: 'topLeft',
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
        placement: 'topLeft',
        duration: 1,
        closeIcon: false,
        style: {
          background: '#ff4444'
        }
      })
    else {
      notification.open({
        message: `Linking page ${start} to page ${end}...`,
        placement: 'topLeft',
        duration: 2,
        closeIcon: false,
        style: {
          background: '#03c4a1'
        }
      })
      setConnections(() => [...connections, [start, end]])
    }
  }

  const onAddNewNode = () => {
    setNodes(() => [...nodes, nodes.length])
    setLocations(() => [
      ...locations,
      {
        x: getMidRandom(70) * window.innerWidth,
        y: getMidRandom(40) * window.innerHeight
      }
    ])
  }

  const findConnections = (n) => {
    return connections.filter(([a]) => a === n).map(([_, b]) => b)
  }

  const data = ranks
    .map((r, i) => ({ id: i, score: r }))
    .sort((a, b) => b.score - a.score)

  console.log(data)

  return (
    <div className="app-wrapper">
      <div className="page-ranks">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ hideOnSinglePage: true, defaultPageSize: 10000000 }}
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
          addonBefore="Page"
          value={start}
          onChange={(e) => setStart(parseInt(e.target.value, 10) || 0)}
        />{' '}
        to{' '}
        <Input
          addonBefore="Page"
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
