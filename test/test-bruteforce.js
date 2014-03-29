"use strict"

var castRay = require("./bruteforce-ray")
var tape = require("tape")

tape("bruteforce-test", function(t) {

  var segments = [
    [[0,0], [0,1]],
    [[0,1], [0,2]],
    [[0,2], [0,3]],

    [[1,0], [2,0]],
    [[1,1], [2,1]],
    [[1,2], [2,2]]
  ]

  t.equals(castRay(segments, [0,-1]), 0)
  t.equals(castRay(segments, [0, 0.5]), 0)
  t.equals(castRay(segments, [0, 1]), 1)
  t.equals(castRay(segments, [0, 2.5]), 2)
  t.equals(castRay(segments, [0, 10]), -1)




  t.end()
})