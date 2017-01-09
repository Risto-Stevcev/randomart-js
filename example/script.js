var hash = 'fc94b0c1e5b0987c5843997697ee9fb7'

var RandomartCell = React.createClass({
  render: function() {
    var style = {
      color: this.props.color ?
             '#'+ this.props.color : '#000'
    }
    return <td style={style}>{this.props.cell}</td>
  }
})

var RandomartRow = React.createClass({
  render: function() {
    var cells = this.props.row.map(function(cell, idx) {
      if (cell.symbol) {
        return <RandomartCell color={cell.color} cell={cell.symbol} key={'c'+idx}/>
      }
      else {
        return <RandomartCell cell={cell} key={'c'+idx}/>
      }    
    })
    return <tr>{cells}</tr>
  }
})

var RandomartRows = React.createClass({
  render: function() {
    var rows = this.props.rows.map(function(row, idx) {
      return <RandomartRow row={row} key={'r'+idx}/>
    })
    return <tbody>{rows}</tbody>
  }
})

var Randomart = React.createClass({  
  render: function() {
    return <table>
      <RandomartRows rows={this.props.art}/>
    </table>
  }
})


var rainbow = new Rainbow()
rainbow.setNumberRange(0, hash.length * 2)

var pairs = randomart.bufferToBinaryPairs(randomart.hexToBuffer(hash))
var walk = randomart.getWalk(pairs)

var art = randomart.render(hash)

var colorArt = function(art, limit) {
  walk.slice(0, limit).forEach(function(coord, idx) {
    var point = art[coord.y][coord.x]   
    art[coord.y][coord.x] = {
      symbol: point.symbol || point,
      color: rainbow.colourAt(idx)
    }
  })
}

var trail = randomart.render(hash, { trail: true })

trail.forEach(function(stage, idx) {
  colorArt(stage, idx)
  setTimeout(function() {
    ReactDOM.render(<Randomart art={stage} />, document.getElementById('randomart'))
  }, idx * 100)
})
