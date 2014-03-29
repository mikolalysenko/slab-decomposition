"use strict"

var tape = require("tape")
var slabDecomposition = require("../slabs.js")
var checkInvariant = require("./invariant.js")
var fullVerify = require("./full-verify.js")

tape("easy test", function(t) {

  var segments = [
    [ [0,0], [1,0] ],
    [ [0.5,1], [2.0, 1] ],
    [ [2,1], [3,0] ],
    [ [0,1], [0, 10] ],
    [ [0,-2], [0, -10] ] ]

  var slab = slabDecomposition(segments)

  checkInvariant(t, slab)

  t.equals(slab.castUp([0.2, -1]), 0)
  t.equals(slab.castUp([0.7, -1]), 0)
  t.equals(slab.castUp([0.7, 0.1]), 1)
  t.equals(slab.castUp([0,0.5]), 3)
  t.equals(slab.castUp([0,-3]), 4)
  t.equals(slab.castUp([0,-20]), 4)
  t.equals(slab.castUp([0,100]), -1)


  fullVerify(t, segments)

  t.end()
})

tape("rhombus", function(t) {

  var segments = [
    [[0.1, 0.1], [0.3, 0.7]],
    [[0.1, 0.1], [0.7, 0.3]],
    [[0.3, 0.7], [0.7, 0.3]],
    [[0.3, 0.7], [0.9, 0.9]],
    [[0.7, 0.3], [0.9, 0.9]]
  ]

  fullVerify(t, segments)

  t.end()
})

/*
tape("pinwheel", function(t) {

  var segments = []

  for(var i=0; i<32; ++i) {
    var theta = (i/16) * Math.PI
    segments.push([[0,0], [Math.cos(i), Math.sin(i)]])
  }

  fullVerify(t, segments)

  t.end()
})
*/