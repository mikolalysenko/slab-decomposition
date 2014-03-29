"use strict"

module.exports = orderSegments

var orient = require("robust-orientation")

function orderSegments(a, b) {
  var al, ar
  if(a[0][0] < a[1][0]) {
    al = a[0]
    ar = a[1]
  } else {
    al = a[1]
    ar = a[0]
  }
  var bl, br
  if(b[0][0] < b[1][0]) {
    bl = b[0]
    br = b[1]
  } else {
    bl = b[1]
    br = b[0]
  }
  var d
  if(al[0] < bl[0]) {
    d = orient(bl, al, ar)
  } else {
    d = orient(al, bl, br)
  }
  if(d) {
    return d
  }
  return ar[0] - br[0]
}