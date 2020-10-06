import React from 'react'
import Draggable from 'react-draggable'
import './Node.scss'

export default ({ id, connections, value, position, hover, setHover }) => {
  return (
    <Draggable defaultPosition={position}>
      <div
        className="node-wrapper"
        onMouseEnter={() => {
          setHover(id)
        }}
        onMouseLeave={() => {
          setHover(null)
        }}
        style={{
          boxShadow: connections.includes(hover) ? "0px 0px 3px 3px yellow" : ''
        }}
      >
        <div className="node-id">
          Page <span>{id}</span>
        </div>
        <div className="node-connections">
          {connections.length
            ? connections
              .sort((a, b) => a - b)
              .map((n, i) => (
                <p key={i}>
                  Link to{' '}
                  <span style={{ color: hover === n ? 'red' : 'green' }}>
                    {n}
                  </span>
                </p>
              ))
            : 'none'}
        </div>
        <div className="node-value">{value}</div>
      </div>
    </Draggable>
  )
}
