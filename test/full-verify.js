"use strict"

module.exports = verifyFull

var createSlabs = require("../slabs.js")
var rayBrutal = require("./bruteforce-ray")
var invariant = require("./invariant")
var genPoints = require("./generate-test-points")

function verifyFull(t, segments) {
  function perm(rotate, flipX, flipY) {
    var signX = flipX ? -1 : 1
    var signY = flipY ? -1 : 1
    var result = new Array(segments.length)
    for(var i=0; i<segments.length; ++i) {
      var s = new Array(2)
      for(var j=0; j<2; ++j) {
        var p = segments[i][j]
        if(rotate) {
          s[j] = [ signX * p[1], signY * p[0] ]
        } else {
          s[j] = [ signX * p[0], signY * p[1] ]
        }
      }
      result[i] = s
    }
    return result
  }

  function doTest(s) {
    var slabs = createSlabs(s)
    invariant(t, slabs)
    var points = genPoints(s)
    for(var i=0; i<points.length; ++i) {
      t.equals(slabs.castUp(points[i]), rayBrutal(s, points[i]), "castRay(" + points[i].join() + ")")
    }
  }

  doTest(segments)
  doTest(perm(false, false, true))
  doTest(perm(false, true, true))
  doTest(perm(false, true, true))
  doTest(perm(true, false, false))
  doTest(perm(true, false, true))
  doTest(perm(true, true, false))
  doTest(perm(true, true, true))
}