"use strict"

module.exports = createSlabDecomposition

var bounds = require("binary-search-bounds")
var createRBTree = require("functional-red-black-tree")
var orient = require("robust-orientation")
var orderSegments = require("./lib/order-segments")

function SlabDecomposition(slabs, coordinates, horizontal) {
  this.slabs = slabs
  this.coordinates = coordinates
  this.horizontal = horizontal
}

var proto = SlabDecomposition.prototype

function compareHorizontal(e, y) {
  return e.y - y
}

proto.castUp = function(p) {
  var bucket = bounds.le(this.coordinates, p[0])
  if(bucket < 0) {
    return -1
  }
  var root = this.slabs[bucket]
  var lastHit = -1
  var lastSegment = null
  while(root) {
    var seg = root.key, o
    if(seg[0][0] < seg[1][0]) {
      o = orient(p, seg[0], seg[1])
    } else {
      o = orient(p, seg[1], seg[0])
    }
    if(o < 0) {
      root = root.left
    } else if(o > 0) {
      lastHit = root.value
      lastSegment = seg
      root = root.right
    } else {
      return root.value
    }
  }
  //Edge case: need to handle horizontal segments
  if(this.coordinates[bucket] === p[0]) {
    var horiz = this.horizontal[bucket]
    if(horiz.length > 0) {
      var hbucket = bounds.ge(horiz, p[1], compareHorizontal)
      if(hbucket < horiz.length) {
        var e = horiz[hbucket]
        //Check if e is above/below last segment
        if(lastSegment && e.start) {
          var o
          if(lastSegment[0][0] < lastSegment[1][0]) {
            o = orient([p[0], e.y], lastSegment[0], lastSegment[1])
          } else {
            o = orient([p[0], e.y], lastSegment[1], lastSegment[0])
          }
          if(o > 0) {
            lastHit = e.index
          }
        } else {
          lastHit = e.index
        }
      }
    }
  }
  return lastHit
}

function IntervalSegment(y, index, start) {
  this.y = y
  this.index = index
  this.start = start
}

function Event(x, segment, create, index) {
  this.x = x
  this.segment = segment
  this.create = create
  this.index = index
}

function createSlabDecomposition(segments) {
  var numSegments = segments.length
  var numEvents = 2 * numSegments
  var events = new Array(numEvents)
  for(var i=0; i<numSegments; ++i) {
    var s = segments[i]
    var f = s[0][0] < s[1][0]
    events[2*i] = new Event(s[0][0], s, f, i)
    events[2*i+1] = new Event(s[1][0], s, !f, i)
  }
  events.sort(function(a,b) {
    var d = a.x - b.x
    if(d) {
      return d
    }
    d = b.create - a.create
    if(d) {
      return d
    }
    return Math.min(a.segment[0][1], a.segment[1][1]) - Math.min(b.segment[0][1], b.segment[1][1])
  })
  var tree = createRBTree(orderSegments)
  var slabs = []
  var lines = []
  var horizontal = []
  var lastX = -Infinity
  for(var i=0; i<numEvents; ) {
    var x = events[i].x
    var horiz = []
    while(i < numEvents) {
      var e = events[i]
      if(e.x !== x) {
        break
      }
      i += 1
      if(e.segment[0][0] === e.x && e.segment[1][0] === e.x) {
        if(e.create) {
          horiz.push(new IntervalSegment(
              Math.min(e.segment[0][1], e.segment[1][1]),
              e.index,
              true))
          horiz.push(new IntervalSegment(
              Math.max(e.segment[0][1], e.segment[1][1]),
              e.index,
              false))
        }
      } else {
        if(e.create) {
          tree = tree.insert(e.segment, e.index)
        } else {
          tree = tree.remove(e.segment)
        }
      }
    }
    slabs.push(tree.root)
    lines.push(x)
    horizontal.push(horiz)
  }
  return new SlabDecomposition(slabs, lines, horizontal)
}