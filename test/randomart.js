const expect = require('chai').expect
const randomart = require('../src/randomart')
const R = require('ramda')

let examples = [ 'fc94b0c1e5b0987c5843997697ee9fb7'
               , '091d0fdac8fde9405342997697ee9fb7'
               , '1c71a28db74f09c8dd40697997ee9fb7'
               , 'fc94d070b2c82dd91b44697997ee9fb7'
               ]

let buffers = examples.map(e => Buffer.from(e, 'hex'))

describe('bufferToBinaryPairs', function() {
  it('should produce the correct binary pairs from a buffer', function() {
    expect(randomart.bufferToBinaryPairs(buffers[0]))
      .to.deep.equal(['00','11','11','11','00','01','01','10','00','00','11','10','01','00','00','11'
                     ,'01','01','10','11','00','00','11','10','00','10','01','10','00','11','11','01'
                     ,'00','10','01','01','11','00','00','01','01','10','01','10','10','01','11','01'
                     ,'11','01','01','10','10','11','10','11','11','11','01','10','11','01','11','10'])
  })
})


describe('getWalk', function() {
  it('should get the correct walk for a buffer', function() {
    let walk = randomart.getWalk(randomart.bufferToBinaryPairs(buffers[0]))
    expect(randomart.walkToNumeric(walk))
      .to.deep.equal([76, 58, 76, 94, 112, 94, 78, 62, 78,  60,  42,  60,  76,  60,  42,  24
                     ,42, 26, 10, 26,  44, 26,  8, 26, 42,  24,  40,  24,  40,  22,  40,  58
                     ,42, 24, 40, 24,   8, 26,  8,  7,  8,   9,  25,   9,  25,  41,  25,  43
                     ,27, 45, 29, 13,  29, 45, 63, 79, 97, 115, 133, 117, 133, 151, 135, 152, 151])
  })
})


describe('render', function() {
  it('should render the correct randomart image', function() {
    let expected = [[' ',' ',' ',' ',' ',' ',' ','.','=','o','.',' ',' ','.',' ',' ',' ']
                   ,[' ',' ',' ',' ',' ','.',' ','*','+','*','.',' ','o',' ',' ',' ',' ']
                   ,[' ',' ',' ',' ',' ',' ','=','.','*','.','.','o',' ',' ',' ',' ',' ']
                   ,[' ',' ',' ',' ',' ',' ',' ','o',' ','+',' ','.','.',' ',' ',' ',' ']
                   ,[' ',' ',' ',' ',' ',' ',' ',' ','S',' ','o','.',' ',' ',' ',' ',' ']
                   ,[' ',' ',' ',' ',' ',' ',' ',' ',' ','o',' ',' ','.',' ',' ',' ',' ']
                   ,[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','.',' ',' ','.',' ','.',' ']
                   ,[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','o',' ','.']
                   ,[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','E','.']]

    expect(randomart.render(buffers[0])).to.deep.equal(expected)
    expect(R.last(randomart.render(buffers[0], { trail: true }))).to.deep.equal(expected)
  })

  it('should render the same randomart image for collision hashes', function() {
    expect(R.all(R.equals(randomart.render(buffers[0])))(buffers.map(randomart.render))).to.be.true
  })
})


describe('gridToString', function() {
  it('should pretty print the grid', function() {
    expect(randomart.gridToString(randomart.render(buffers[0])))
      .to.equal('[ ][ ][ ][ ][ ][ ][ ][.][=][o][.][ ][ ][.][ ][ ][ ]\n' +
                '[ ][ ][ ][ ][ ][.][ ][*][+][*][.][ ][o][ ][ ][ ][ ]\n' +
                '[ ][ ][ ][ ][ ][ ][=][.][*][.][.][o][ ][ ][ ][ ][ ]\n' +
                '[ ][ ][ ][ ][ ][ ][ ][o][ ][+][ ][.][.][ ][ ][ ][ ]\n' +
                '[ ][ ][ ][ ][ ][ ][ ][ ][S][ ][o][.][ ][ ][ ][ ][ ]\n' +
                '[ ][ ][ ][ ][ ][ ][ ][ ][ ][o][ ][ ][.][ ][ ][ ][ ]\n' +
                '[ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][.][ ][ ][.][ ][.][ ]\n' +
                '[ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][o][ ][.]\n' +
                '[ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][E][.]')
  })
})
