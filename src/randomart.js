var R = require('ramda')

// Default options
var defaults = {
  height: 9,
  width: 17,
  trail: false,
  values: [' ', '.', 'o', '+', '=', '*', 'B', 'O', 'X', '@', '%', '&', '#', '/', '^']
}

// Renders the randomart image from a given hash
var render = function render(hash, options) {
  var options = R.merge(defaults, typeof options === 'object' ? options : {})

  if (!(hash instanceof Buffer || typeof hash === 'string') || hash.length === 0) {
    throw TypeError('You must pass in a non-zero length hash or string')
  }
  if (!(typeof options.height === 'number') || !(typeof options.width  === 'number')) {
    throw TypeError('The height and width options must be numbers')
  }
  if (!(typeof options.trail === 'boolean')) {
    throw TypeError('The trail option must be a boolean')
  }
  if (!(options.values instanceof Array) ||
      !options.values.every(function(value) { return typeof value === 'string' && value.length === 1 })) {
    throw TypeError('The values option must an array of single character strings')
  }


  if ((options.height % 2 !== 1) || (options.width  % 2 !== 1)) {
    throw Error('The height and width options must be odd numbers')
  }
  if (hash.length % 2 !== 0) {
    throw Error('The hash length must have an even number')
  }


  var width  = options.width  || 17
    , height = options.height || 9
    , trail  = options.trail  || false
    , values = options.values || [' ', '.', 'o', '+', '=', '*', 'B', 'O', 'X', '@', '%', '&', '#', '/', '^']

  var pairs    = bufferToBinaryPairs(typeof hash === 'string' ? Buffer.from(hash, 'hex') : hash)
    , walk     = getWalk(pairs, width, height)
    , grid     = R.repeat([], height).map(function(line) { return R.repeat(' ', width) })

  var updateGrid = gridReducer(values)

  if (trail)
    return walk.reduce(function(grids, coord, idx, walk) {
      return grids.concat([updateGrid(R.last(grids), coord, idx, walk)])
    }, [grid])
  else
    return walk.reduce(updateGrid, grid)
}

// Converts a hex string to a buffer
var hexToBuffer = function hexToBuffer(str) {
  return Buffer.from(str, 'hex')
}

// The reducer for converting the walk into the grid
var gridReducer = function gridReducer(values) {
  return function updateGrid(grid, coord, idx, walk) {
    if (idx === walk.length - 1) {
      return R.pipe( R.set(R.lensPath([walk[0].y, walk[0].x]), 'S')
                   , R.set(R.lensPath([coord.y,   coord.x]),   'E')
                   )(grid)
    }
    var newValue = values[values.indexOf(grid[coord.y][coord.x]) + 1]
    return R.set(R.lensPath([coord.y, coord.x]), newValue, grid)
  }
}

// Pretty prints a 2d array (matrix)
var gridToString = function gridToString(grid) {
  return grid.map(function(line) { return '['+ line.join('][') +']' }).join('\n')
}

// Converts a buffer to a binary pairs array
var bufferToBinaryPairs = function bufferToBinaryPairs(buffer) {
  var str = []
  buffer.forEach(function(value) {
    var binaryValue = value.toString(2)
    if (binaryValue.length < 8)
      binaryValue = R.repeat('0', 8 - binaryValue.length).join('') + binaryValue
    str.push(binaryValue)
  })
  return R.flatten(str.map(R.pipe(R.splitEvery(2), R.reverse)))
}

// Gets the walk from a set of pairs and the box's height and width
var getWalk = function getWalk(pairs, width, height) {
  var width  = width  || defaults.width
    , height = height || defaults.height

  var initialPosition = { x: (width - 1) / 2, y: (height - 1) / 2 }

  return pairs.reduce(function(acc, pair) {
    var position = acc[acc.length - 1]

    var noMove        = position
      , X             = position.x
      , Y             = position.y

      , leftEdge      = 0
      , topEdge       = 0
      , rightEdge     = width  - 1
      , bottomEdge    = height - 1

      , leftX         = position.x - 1
      , rightX        = position.x + 1
      , upY           = position.y - 1
      , downY         = position.y + 1

      , moveLeft      = { x: leftX , y: Y     }
      , moveRight     = { x: rightX, y: Y     }
      , moveUp        = { x: X     , y: upY   }
      , moveDown      = { x: X     , y: downY }
      , moveUpLeft    = { x: leftX , y: upY   }
      , moveUpRight   = { x: rightX, y: upY   }
      , moveDownLeft  = { x: leftX , y: downY }
      , moveDownRight = { x: rightX, y: downY }

    // Top-left position (a)
    if (R.equals(position, { x: leftEdge, y: topEdge })) {
      switch (pair) {
        case '00': return acc.concat(position)
        case '01': return acc.concat(moveRight)
        case '10': return acc.concat(moveDown)
        case '11': return acc.concat(moveDownRight)
      }
    }
    // Top-right position (b)
    else if (R.equals(position, { x: rightEdge, y: topEdge })) {
      switch (pair) {
        case '00': return acc.concat(moveLeft)
        case '01': return acc.concat(position)
        case '10': return acc.concat(moveDownLeft)
        case '11': return acc.concat(moveDown)
      }
    }
    // Bottom-left position (c)
    else if (R.equals(position, { x: leftEdge, y: bottomEdge })) {
      switch (pair) {
        case '00': return acc.concat(moveUp)
        case '01': return acc.concat(moveUpRight)
        case '10': return acc.concat(position)
        case '11': return acc.concat(moveRight)
      }
    }
    // Bottom-right position (d)
    else if (R.equals(position, { x: rightEdge, y: bottomEdge })) {
      switch (pair) {
        case '00': return acc.concat(moveUpLeft)
        case '01': return acc.concat(moveUp)
        case '10': return acc.concat(moveLeft)
        case '11': return acc.concat(position)
      }
    }
    // Top position (T)
    else if (position.y === topEdge) {
      switch (pair) {
        case '00': return acc.concat(moveLeft)
        case '01': return acc.concat(moveRight)
        case '10': return acc.concat(moveDownLeft)
        case '11': return acc.concat(moveDownRight)
      }
    }
    // Bottom position (B)
    else if (position.y === bottomEdge) {
      switch (pair) {
        case '00': return acc.concat(moveUpLeft)
        case '01': return acc.concat(moveUpRight)
        case '10': return acc.concat(moveLeft)
        case '11': return acc.concat(moveRight)
      }

    }
    // Left position (L)
    else if (position.x === leftEdge) {
      switch (pair) {
        case '00': return acc.concat(moveUp)
        case '01': return acc.concat(moveUpRight)
        case '10': return acc.concat(moveDown)
        case '11': return acc.concat(moveDownRight)
      }
    }
    // Right position (R)
    else if (position.x === rightEdge) {
      switch (pair) {
        case '00': return acc.concat(moveUpLeft)
        case '01': return acc.concat(moveUp)
        case '10': return acc.concat(moveDownLeft)
        case '11': return acc.concat(moveDown)
      }
    }
    // Middle position (M)
    else {
      switch (pair) {
        case '00': return acc.concat(moveUpLeft)
        case '01': return acc.concat(moveUpRight)
        case '10': return acc.concat(moveDownLeft)
        case '11': return acc.concat(moveDownRight)
      }
    }
  }, [initialPosition])
}

// Converts the walk into the numeric format found in the drunken bishop paper
var walkToNumeric = function(walk, width, height) {
  var width  = width  || defaults.width
    , height = height || defaults.height

  var initialPosition = (height - 1) / 2 * width + (width - 1) / 2
  return walk.reduce(function(acc, coord) {
    return acc.concat(coord.y * width + coord.x)
  }, [])
}

module.exports = {
  render: render,
  hexToBuffer: hexToBuffer,
  gridToString: gridToString,
  bufferToBinaryPairs: bufferToBinaryPairs,
  getWalk: getWalk,
  walkToNumeric: walkToNumeric
}
