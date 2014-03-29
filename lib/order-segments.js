"use strict"

module.exports = orderSegments

var orient = require("robust-orientation")

function orderSegments(a, b) {
  var al, ar
  if(a[0][0] < a[1][0]) {
    al = a[0]
    ar = a[1]
  } else if(a[0][0] > a[1][0]) {
    al = a[1]
    ar = a[0]
  } else if(a[0][1] < a[1][1]) {
    ar = a[0]
    al = a[1]
  } else {
    ar = a[1]
    al = a[0]
  }
  var bl, br
  if(b[0][0] < b[1][0]) {
    bl = b[0]
    br = b[1]
  } else if(b[0][0] > b[1][0]) {
    bl = b[1]
    br = b[0]
  } else if(b[0][1] < b[1][1]) {
    br = b[0]
    bl = b[1]
  } else {
    br = b[1]
    bl = b[0]
  }
  var d = orient(al, ar, bl)
  if(d) {
    return d
  }
  d = orient(al, ar, br)
  if(d) {
    return d
  }
  d = orient(br, bl, al)
  if(d) {
    return d
  }
  d = orient(br, bl, ar)
  if(d) {
    return d
  }
  return ar[0] - br[0]
}